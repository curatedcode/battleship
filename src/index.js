import './styles.css'
import { showGameBoard } from './display'


document.querySelector('.play-container > button').addEventListener('click',()=>{
    showGameBoard()
})