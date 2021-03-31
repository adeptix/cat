const templateComment = document.querySelector('#comment_tmpl').content
const textArea = document.getElementById('comment_add_area')
const authorArea = document.getElementById('comment_author_add_area')
const buttonAdd = document.querySelector('#add_btn')
const buttonCancel = document.querySelector('#cancel_btn')
const commentSection = document.querySelector('.comment_section')
const sortBtn = document.querySelector('.comment_list_head button')

const STATE_NORMAL = 0
const STATE_EDIT = 1

let state = STATE_NORMAL
let editElem = null

const SORT_ASC = "asc"
const SORT_DESC = "desc"

let sortState = SORT_ASC


class CommentHandler {
    constructor(store) {
        this.store = store

        setSortBtnText()

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

        this.restoreAll()
        this.comCounter = new CommentCounter(this.store.count)
    }

    //create and save
    create(text, author) {
        let createdAt = new Date()
        let id = this.store.lastID

        let commentObj = {id, text, author, createdAt}
        this.store.add(commentObj)
        this.show(commentObj, true)
        this.comCounter.inc()
    }

    show(commentObj, isNew) {
        this.commentPost.id = commentObj.id
        this.authorText.textContent = commentObj.author
        this.createdAtText.textContent = this.dateFormatter.format(Date.parse(commentObj.createdAt))
        this.commentText.textContent = commentObj.text

        let cmt = templateComment.cloneNode(true);

        if (!isNew) {
            commentSection.append(cmt)
            return
        }

        if (sortState === SORT_ASC) {
            commentSection.append(cmt)
        } else {
            commentSection.prepend(cmt)
        }
    }

    restoreAll() {
        this.store.savedComments.forEach(c => this.show(c, false))
    }

    editStart(elem) {
        if (state === STATE_EDIT) {
            return
        }

        state = STATE_EDIT

        textArea.value = elem.querySelector('.comment_text').textContent
        authorArea.value = elem.querySelector('.comment_author').textContent
        buttonAdd.textContent = 'Сохранить'

        editElem = elem
        buttonCancel.style.visibility = 'visible'
    }

    editEnd() {
        if (editElem === null) {
            return
        }

        editElem.querySelector('.comment_text').textContent = textArea.value
        editElem.querySelector('.comment_author').textContent = authorArea.value
        buttonAdd.textContent = 'Добавить'

        this.store.edit({id: editElem.id, author: authorArea.value, text: textArea.value})

        editElem = null
        state = STATE_NORMAL

        textArea.value = ''
        authorArea.value = ''
        buttonCancel.style.visibility = 'hidden'
    }

    editCancel() {
        if (editElem === null) {
            return
        }

        editElem = null
        state = STATE_NORMAL

        textArea.value = ''
        authorArea.value = ''
        buttonCancel.style.visibility = 'hidden'
    }

    delete(elem) {
        if (state === STATE_EDIT) {
            return
        }

        this.store.delete(elem.id)
        elem.remove()
        this.comCounter.dec()
    }
}

class CommentCounter {
    constructor(startCount) {
        this.count = startCount
        this.commentCounter = document.querySelector('.comment_list_head div')
        this.show()
    }

    inc() {
        this.count++
        this.show()
    }

    dec() {
        this.count--
        this.show()
    }

    show() {
        this.commentCounter.textContent = `Комментарии (${this.count})`
    }
}

class Sorter {


    constructor(commentHandler, store) {
        this.ch = commentHandler
        this.store = store
    }

    sort() {
        if (state === STATE_EDIT) {
            return
        }

        this.store.reverse()

        commentSection.innerHTML = ''

        this.store.savedComments.forEach(c => this.ch.show(c, false))

        sortState = (sortState === SORT_ASC) ? SORT_DESC : SORT_ASC

        this.store.saveSortState()
    }
}

const COM_KEY = 'comments'
const SORT_KEY = 'sort'

class Store {
    savedComments = []

    constructor() {
        let savedComments = JSON.parse(localStorage.getItem(COM_KEY))
        if (savedComments != null) {
            this.savedComments = savedComments
        }

        let savedSort = localStorage.getItem(SORT_KEY)
        if (savedSort != null) {
            sortState = savedSort
        }
    }

    saveSortState(){
        localStorage.setItem(SORT_KEY, sortState)
    }

    get savedComments() {
        return this.savedComments
    }

    get count() {
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

    edit(commentObj) {
        this.savedComments.forEach(sc => {
            if (sc.id === commentObj.id) {
                sc.author = commentObj.author
                sc.text = commentObj.text
            }
        })

        this.saveToJson()
    }

    add(commentObj) {
        if (sortState === SORT_ASC) {
            this.savedComments.push(commentObj)
        } else {
            this.savedComments.unshift(commentObj)
        }

        this.saveToJson()
    }

    delete(id) {
        for (let i = 0; i < this.count; i++) {
            if (this.savedComments[i].id === id) {
                this.savedComments.splice(i, 1);
            }
        }

        this.saveToJson()
    }


    reverse() {
        this.savedComments.reverse()
        this.saveToJson()
    }

    saveToJson() {
        localStorage.setItem(COM_KEY, JSON.stringify(this.savedComments))
    }
}

store = new Store()

const ch = new CommentHandler(store)
const srt = new Sorter(ch, store)

function initClickListeners() {
    buttonAdd.addEventListener('click', () => {
        let text = textArea.value
        let author = authorArea.value

        if (text === "" || author === "") {
            return
        }

        if (state === STATE_EDIT) {
            ch.editEnd()
            return
        }

        ch.create(text, author)

        textArea.value = ''
        authorArea.value = ''
    })

    buttonCancel.addEventListener('click', () => {
        ch.editCancel()

        textArea.value = ''
        authorArea.value = ''
    })
}

initClickListeners()

function deleteCommentAction(elem) {
    ch.delete(elem.parentElement.parentElement)
}

function editCommentAction(elem) {
    ch.editStart(elem.parentElement.parentElement)
}

function setSortBtnText() {
    let btn = document.querySelector('.comment_list_head button')

    if (sortState === SORT_ASC) {
        btn.textContent = 'Сортировка по времени: по возрастанию'
    } else {
        btn.textContent = 'Сортировка по времени: по убыванию'
    }
}

function sortAction() {
    srt.sort()
    setSortBtnText()
}


