const templateComment = document.querySelector('#comment_tmpl').content
const deleteBtn = templateComment.querySelector('.comment_footer_delete')

class CommentHandler {
    constructor() {
        this.store = new Store()

        this.commentSection = document.querySelector('.comment_section')

        //comment template
        this.authorText = templateComment.querySelector('.comment_author')
        this.createdAtText = templateComment.querySelector('.comment_created_at')
        this.commentText = templateComment.querySelector('.comment_text')
        this.commentPost = templateComment.querySelector('.comment_post')

        this.dateFormatter = new Intl.DateTimeFormat('ru', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        })

        this.commentCounter = document.querySelector('.comment_list_head div')
    }


    //create and save
    create(text, author) {
        let createdAt = new Date()
        let id = this.store.lastID

        let commentObj = {id, text, author, createdAt}
        this.store.add(commentObj)
        this.show(commentObj)
        this.commentCounter.textContent = `Комментарии (${this.store.count})`
    }

    show(commentObj) {
        this.commentPost.id = commentObj.id
        this.authorText.textContent = commentObj.author
        this.createdAtText.textContent = this.dateFormatter.format(commentObj.createdAt)
        this.commentText.textContent = commentObj.text

        let cmt = templateComment.cloneNode(true);
        this.commentSection.append(cmt)
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

    get count(){
        return this.savedComments.length
    }

    get lastID() {
        let lastID = -1;
        this.savedComments.forEach(c => {
            let id = parseInt(c.id.substring(1), 10)
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
const authorArea = document.getElementById('comment_author_add_area')

function initClickListeners() {
    const button = document.querySelector('button')
    button.addEventListener('click', () => {
        let text = textArea.value
        let author = authorArea.value

        if (text === "" || author === "") {
            return
        }

        ch.create(text, author)

        textArea.value = ''
        authorArea.value = ''
    })

    const editBtn = templateComment.querySelector('.comment_footer_edit')
}

function deleteCommentAction(e) {
    console.log(e.target)
}

initClickListeners()