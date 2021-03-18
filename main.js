// кажется тут должен быть код...

// Подсказка №1: Содержимое тега textarea хранится в его свойстве value

// Подсказка №2: Не забывайте, что LocalStorage и SessionStorage могут хранить только строки в виде пар ключ/значение

const COM_KEY = 'comments'

let textArea = document.getElementById('comment_add_area')
let button = document.querySelector('button')
let commentZone = document.querySelector('.wrapper')
let commentsJson = localStorage.getItem(COM_KEY)

button.addEventListener('click', addComment)

restoreComments()

function restoreComments() {
    let commentsArray = JSON.parse(commentsJson)

    if (commentsArray == null) {
        return
    }

    commentsArray.forEach(function (item) {
        drawComment(item)
    })
}

function addComment() {
    let text = textArea.value

    if (text === "") {
        return
    }

    drawComment(text)
    saveComment(text)
    textArea.value = ''
}

function drawComment(text) {
    let comment = document.createElement('div')
    comment.classList.add('comment_text')
    comment.innerText = text

    commentZone.append(comment)
}

function saveComment(text) {
    let commentsArray = JSON.parse(commentsJson)

    if (commentsArray == null) {
        commentsArray = []
    }

    commentsArray.push(text)

    commentsJson = JSON.stringify(commentsArray)
    localStorage.setItem(COM_KEY, commentsJson)
}

