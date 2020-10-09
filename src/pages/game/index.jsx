import React, { Component } from "react";
import { getPlayer, addPlayerScore, addPlayerCredits } from "../../actions/player";
import { getWordsByCategory } from "../admin/components/words/actions";
import "./game.css";
import { Redirect } from "react-router-dom";
import img0 from "./images/img0.png";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import img3 from "./images/img3.png";
import img4 from "./images/img4.png";
import img5 from "./images/img5.png";
import img6 from "./images/img6.png";
import img7 from "./images/plateia.png"

const time = 60;

class Hangman extends Component {
    /** by default, allow 6 guesses and use provided gallows images. */
    static defaultProps = {
        images: [img0, img1, img2, img3, img4, img5, img6, img7]
    };

    constructor(props) {
        super(props);
        this.state = { nWrong: 0, maxWrong: 6, seconds: time, guessed: new Set(), answer: "", loading: true, playerScore: 0, playerCredits: 0, scoreToAdd: 100 };
        this.handleGuess = this.handleGuess.bind(this);
        this.reset = this.reset.bind(this);
    }

    async componentDidMount() {
        try {
            await this.reset();
        } catch (error) {
            console.log(error);
        }
    }

    async randomWord() {
        try {
            const categories = JSON.parse(localStorage.getItem("gameCategories"));

            if (categories) {
                const randomCategory = Math.floor(Math.random() * categories.length);
                const words = await getWordsByCategory(categories[randomCategory].value);
                if (words.length === 0) {
                    alert("Nenhuma palavra encontrada para a(s) categoria(s)");
                    window.location.href = '/';
                    return "";
                }
                const randomWord = Math.floor(Math.random() * words.length);
                return words[randomWord].name;
            } else {
                alert("Nenhuma palavra encontrada para a(s) categoria(s)");
                window.location.href = '/';
            }

            return "";
        } catch (error) {
            return "";
        }
    }

    componentWillUnmount() {
        clearInterval(this.hangmanTimer);
    }

    async componentDidUpdate() {
        const gameOver = (this.state.nWrong >= this.state.maxWrong);
        const isWinner = this.guessedWord().join("") === this.state.answer;

        if (gameOver || isWinner) {
            clearInterval(this.hangmanTimer);
        }
    }

    async reset() {
        this.setState({
            loading: true
        });
        await this.loadPlayerInfo();
        const word = await this.randomWord();

        if (word === "") {
            return;
        }

        this.setState({
            nWrong: 0,
            maxWrong: 6,
            seconds: time,
            guessed: new Set(),
            answer: word.toLowerCase(),
            loading: false,
            scoreToAdd: 100,
        });
        this.timer();
    }

    async loadPlayerInfo() {
        const playerId = localStorage.getItem('player');
        if (playerId) {
            const player = await getPlayer(playerId);
            this.setState({
                playerScore: player.score,
                playerCredits: player.credits,
            });
        }
    }

    async addScore() {
        const playerId = localStorage.getItem('player');
        await addPlayerScore(playerId, this.state.scoreToAdd);
        await addPlayerCredits(playerId, 100);
    }

    timer() {
        clearInterval(this.hangmanTimer);
        this.hangmanTimer = setInterval(() => {
            if (this.state.seconds <= 0) {
                clearInterval(this.hangmanTimer);
                this.gameOverPoints();
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
            .map(ltr => (this.state.guessed.has(ltr) ? ltr : (ltr == " ") ? " " : "_"));
    }

    /** handleGuest: handle a guessed letter:
      - add to guessed letters
      - if not in answer, increase number-wrong guesses
    */
    async handleGuess(ltr) {
        //let ltr = evt.target.value;
        this.setState(st => ({
            guessed: st.guessed.add(ltr),
            nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
        }), () => {
            this.gameOverPoints();
        });

        await this.validateWin(ltr);
    }

    gameOverPoints() {
        const gameOver = (this.state.nWrong >= this.state.maxWrong) || this.state.seconds <= 0;
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val || v === " " ? a + 1 : a), 0);
        let points = ((this.guessedWord().length - countOccurrences(this.guessedWord(), '_')) * 10)
        if (gameOver) {
            addPlayerScore(localStorage.getItem('player'), points);
            setTimeout(async () => {
                await this.loadPlayerInfo();
            }, 500);
            points = 0;
        }
    }

    async validateWin(ltr) {
        let guessed = this.state.guessed;
        guessed.add(ltr);

        let guessedResult = this.state.answer
            .split("")
            .map(ltr => (this.state.guessed.has(ltr) ? ltr : (ltr == " ") ? " " : "_"));
        if (guessedResult.join("") === this.state.answer) {
            await this.addScore();
            setTimeout(async () => {
                await this.loadPlayerInfo();
            }, 500);
        }
    }

    /** generateButtons: return array of letter buttons to render */
    generateButtons() {
        return "aãbcçdefghijklmnopqrstuvwxyz".split("").map(ltr => (
            <button
                className="Hangman-btn"
                key={ltr}
                value={ltr}
                onClick={() => this.handleGuess(ltr)}
                disabled={this.state.guessed.has(ltr)}
            >
                {ltr}
            </button>
        ));
    }

    // pode errar um numero maior de letras durante a partida
    bonus1() {
        this.setState({
            maxWrong: 8
        })
    }

    // pontuação em dobro em caso de vitória
    bonus2() {
        this.setState({
            scoreToAdd: 200
        })
    }

    // tempo maior de partida
    bonus3() {
        this.setState(({ seconds }) => ({
            seconds: seconds + 20
        }))
    }

    // revelar letra aleatória
    bonus4() {
        let guessedWord = this.guessedWord();
        let position = Math.floor(Math.random() * guessedWord.length);

        while (guessedWord[position] != "_" || guessedWord[position] == " ") {
            position = Math.floor(Math.random() * guessedWord.length);
        }
        this.handleGuess(this.state.answer.charAt(position))
    }

    // limpar error
    bonus5() {
        this.setState({
            nWrong: 0
        })
    }

    /** render: render game */
    state = { redirect: null };
    render() {
        const gameOver = (this.state.nWrong >= this.state.maxWrong) || this.state.seconds <= 0;
        const altText = `${this.state.nWrong}/${this.state.maxWrong} palpites`;
        const isWinner = this.guessedWord().join("") === this.state.answer;
        let gameState = this.generateButtons();
        const loading = this.state.loading;
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        if (isWinner && !loading) {
            gameState = "Você Venceu!!!";
        } else
            if (gameOver) {

                gameState = "Não foi dessa vez... :(";
            }
        return (
            <section className="game">
                {<button className="game-back" onClick={() => this.setState({ redirect: "/" })}>
                    Voltar
                    </button>}
                <div className="Hangman">
                    <img src={this.props.images[this.state.nWrong]} alt={altText} />
                    <p className="Hangman-wrong">Erros: {this.state.nWrong}</p>
                    <p className="Hangman-timer">Tempo: {this.state.seconds}</p>
                    <p className="Player-score">Pontos: {this.state.playerScore}</p>
                    <p className="Player-credits">Créditos: {this.state.playerCredits}</p>
                    <p className="Hangman-word">
                        {
                            this.state.loading ?
                                "Carregando..."
                                :
                                !gameOver ? this.guessedWord() : this.state.answer
                        }
                    </p>
                    {
                        !this.state.loading &&
                        <p className="Hangman-btns">{gameState}</p>
                    }
                    {<button className="Hangman-reset" onClick={this.reset}>
                        Recomeçar
                    </button>}
                    {<button className="Hangman-reset" style={{ left: '5%' }} onClick={() => this.bonus1()}>
                        Bonus 1
                    </button>}
                    {<button className="Hangman-reset" style={{ left: '20%' }} onClick={() => this.bonus2()}>
                        Bonus 2
                    </button>}
                    {<button className="Hangman-reset" style={{ left: '35%' }} onClick={() => this.bonus3()}>
                        Bonus 3
                    </button>}
                    {<button className="Hangman-reset" style={{ left: '50%' }} onClick={() => this.bonus4()}>
                        Bonus 4
                    </button>}
                    {<button className="Hangman-reset" style={{ left: '65%' }} onClick={() => this.bonus5()}>
                        Bonus 5
                    </button>}
                </div>
                <img src={this.props.images[7]} className="plateia" alt="plateia" />
            </section>
        );
    }
}
export default Hangman;

