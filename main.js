const templateComment = document.querySelector('#comment_tmpl').content
const deleteBtn = templateComment.querySelector('.comment_footer_delete')

class CommentHandler {
    constructor() {
        this.store = new Store()

        this.commentZone = document.querySelector('.wrapper')

        //comment template

        this.authorText = templateComment.querySelector('.comment_author')
        this.createdAtText = templateComment.querySelector('.comment_created_at')
        this.commentText = templateComment.querySelector('.comment_text')
        this.commentPost = templateComment.querySelector('.comment_post')
    }


    //create and save
    create(text, author) {
        let createdAt = new Date()
        let id = this.store.lastID

        let commentObj = {id, text, author, createdAt}
        this.store.add(commentObj)
        this.show(commentObj)
    }

    show(commentObj) {
        this.commentPost.id = commentObj.id
        this.authorText.textContent = commentObj.author
        this.createdAtText.textContent = commentObj.createdAt
        this.commentText.textContent = commentObj.text

        deleteBtn.addEventListener('click', event => {
            console.log(event.target.parentNode.parentNode)
        })

        let cmt = templateComment.cloneNode(true);
        this.commentZone.append(cmt)
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
        let savedComments = JSON.parse(localStorage.getItem(COM_KEY))
        if (savedComments != null) {
            this.savedComments = savedComments
        }
    }

    get savedComments() {
        return this.savedComments
    }

    get lastID() {
        let lastID = -1;
        this.savedComments.forEach(c => {
            let id = c.id.substring(1)
            if (id > lastID) {
                lastID = id
            }
        })

        return `c${++lastID}`
    }

    edit() {

    }

    add(comment) {
        this.savedComments.push(comment)
        localStorage.setItem(COM_KEY, JSON.stringify(this.savedComments))
    }

    delete() {

    }
}

const ch = new CommentHandler()
const textArea = document.getElementById('comment_add_area')

function initClickListeners() {
    const button = document.querySelector('button')
    button.addEventListener('click', () => {
        let text = textArea.value

        if (text === "") {
            return
        }

        ch.create(text, "not me")

        textArea.value = ''
    })

    const editBtn = templateComment.querySelector('.comment_footer_edit')


}

initClickListeners()