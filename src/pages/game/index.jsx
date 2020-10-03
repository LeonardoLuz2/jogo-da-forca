import React, { Component } from "react";
import "./game.css";
// import { randomWord } from "./words";
import img0 from "./images/img0.png";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import img3 from "./images/img3.png";
import img4 from "./images/img4.png";
import img5 from "./images/img5.png";
import img6 from "./images/img6.png";
import img7 from "./images/plateia.png"

class Hangman extends Component {
    /** by default, allow 6 guesses and use provided gallows images. */
    static defaultProps = {
        maxWrong: 6,
        images: [img0, img1, img2, img3, img4, img5, img6, img7]
    };

    constructor(props) {
        super(props);
        this.state = { nWrong: 0, seconds: 60, guessed: new Set(), answer: "controle"/*randomWord()*/ };
        this.handleGuess = this.handleGuess.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        this.timer();
    }

    componentWillUnmount() {
        clearInterval(this.hangmanTimer);
    }

    reset() {
        this.setState({
            nWrong: 0,
            seconds: 60,
            guessed: new Set(),
            answer: "controle"/*randomWord()*/
        });
        this.timer();
    }

    timer() {
        clearInterval(this.hangmanTimer);
        this.hangmanTimer = setInterval(() => {
            if (this.state.seconds <= 0) {
                clearInterval(this.hangmanTimer);
            } else {                
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
        }, 1000);
    }

    /** guessedWord: show current-state of word:
      if guessed letters are {a,p,e}, show "app_e" for "apple"
    */
    guessedWord() {
        return this.state.answer
            .split("")
            .map(ltr => (this.state.guessed.has(ltr) ? ltr : "_"));
    }

    /** handleGuest: handle a guessed letter:
      - add to guessed letters
      - if not in answer, increase number-wrong guesses
    */
    handleGuess(evt) {
        let ltr = evt.target.value;
        this.setState(st => ({
            guessed: st.guessed.add(ltr),
            nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
        }));
    }

    /** generateButtons: return array of letter buttons to render */
    generateButtons() {
        return "aãbcçdefghijklmnopqrstuvwxyz".split("").map(ltr => (
            <button
                className="Hangman-btn"
                key={ltr}
                value={ltr}
                onClick={this.handleGuess}
                disabled={this.state.guessed.has(ltr)}
            >
                {ltr}
            </button>
        ));
    }

    /** render: render game */
    render() {
        const gameOver = (this.state.nWrong >= this.props.maxWrong) || this.state.seconds <= 0;
        const altText = `${this.state.nWrong}/${this.props.maxWrong} palpites`;
        const isWinner = this.guessedWord().join("") === this.state.answer;
        let gameState = this.generateButtons();
        if (isWinner) {
            gameState = "Você Venceu!!!";
            clearInterval(this.hangmanTimer);
        }
        if (gameOver) gameState = "Não foi dessa vez... :(";
        return (
            /*Descomentar o html quando as funcionalidades forem pra sprint*/
            <section className="game">

                <div className="Hangman">
                    <img src={this.props.images[this.state.nWrong]} alt={altText} />
                    <p className="Hangman-wrong">Erros: {this.state.nWrong}</p>
                    <p className="Hangman-timer">Tempo: {this.state.seconds}</p>
                    <p className="Hangman-word">
                        {!gameOver ? this.guessedWord() : this.state.answer}
                    </p>
                    <p className="Hangman-btns">{gameState}</p>
                    {<button className="Hangman-reset" onClick={this.reset}>
                        Recomeçar
                    </button>}
                </div>
                <img src={this.props.images[7]} className="plateia" alt="plateia" />
            </section>
        );
    }
}
export default Hangman;

