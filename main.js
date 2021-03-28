const commentZone = document.querySelector('.wrapper')

const templateComm = document.querySelector('#comment_tmpl').content
const authorSpan = templateComm.querySelector("#comment_author")
const createdAtSpan = templateComm.querySelector("#comment_created_at")
const commentDiv = templateComm.querySelector("#comment_text")

class Comment {
    constructor(text, author, createdAt) {
        this.text = text
        this.author = author
        this.createdAt = createdAt
    }

    show() {
        authorSpan.textContent = this.author
        createdAtSpan.textContent = this.createdAt
        commentDiv.textContent = this.text

        let cmt = templateComm.cloneNode(true);
        commentZone.append(cmt)
    }

    edit() {

    }

    delete() {

    }
}

const COM_KEY = 'comments'

class Store {
    savedComments = []

    constructor() {
        console.log(COM_KEY)

        let savedComments = JSON.parse(localStorage.getItem(COM_KEY))
        if (savedComments != null) {
            savedComments.forEach(sc => this.savedComments.push(new Comment(sc.text, sc.author, sc.createdAt)))
        }
    }

    get savedComments() {
        return this.savedComments
    }

    restoreComments() {
        this.savedComments.forEach(c => c.show())
    }

    edit() {

    }

    add(comment) {
        this.savedComments.push(comment)
        console.log(this.savedComments.type)
        localStorage.setItem(COM_KEY, JSON.stringify(this.savedComments))
    }

    delete() {

    }
}

const textArea = document.getElementById('comment_add_area')
const button = document.querySelector('button')

button.addEventListener('click', addComment)

const store = new Store()
store.restoreComments()

function addComment() {
    let text = textArea.value

    if (text === "") {
        return
    }

    let now = new Date();
    let comment = new Comment(text, 'me', now)
    comment.show()
    store.add(comment)

    textArea.value = ''
}

