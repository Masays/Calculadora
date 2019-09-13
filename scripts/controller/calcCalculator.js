class CalcCalculator {
    constructor() {
        this._operation = []
        this._operator = ''
        this._number = ''
        this._lastOperation = ''
        this._audioPlay = false
        this._audio = new Audio('click.mp3')
        this._display = document.querySelector('#display')
        this._buttons = document.querySelectorAll('button[id^="btn-"]')
        this.initialize()
    }

    initialize() {
        this.initPlayEvent()
        this.initButtonEvent()
        this.initKeyboardEvent()
        this.pasteFromClipboard()
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let textCopy = e.clipboardData.getData('text')
            this.showDisplay = Number(textCopy)
        })
    }

    copyKeyboard() {
        let copy = document.createElement('input')
        copy.value = this.showDisplay
        document.body.appendChild(copy)
        copy.select()
        document.execCommand('Copy')
        copy.remove()
    }

    togglePlay() {
        this._audioPlay = !this._audioPlay
    }

    playAudio() {
        if(this._audioPlay) {
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    cleanAll() {
        this._operation.splice(0, this._operation.length)
        this.showDisplay = 0
    }

    cleanEntry() {
        this._operation.pop()

        for(let i = this._operation.length; i >= 0; i--) {
            if (!this.isOperator(i) && this._operation.length !== 0) {
                this.showDisplay = this._operation[i]
            } else {
                this.showDisplay = 0
            }
        }
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value) {
        return this._operation[this._operation.length - 1] = value
    }

    getResult() {
        return eval(this._operation.join(''))
    }

    isOperator(value) {
        return (['+', '-', '/', '*', '**', '%', '√', '1/'].includes(value))
    }

    arrOperator(value) {
        if (this._operation.length === 0 && value !== '1/') {
            this._operation.push(this._number = 0)
        } else if (value === '1/') {
            if (this._operation.length === 0) {
                this.error()
            } else {
                this._operation.unshift(this._operator = '/')
                this._operation.unshift(this._number = 1)
                this.calc()
            }
        } else if (value === '√') {
            if (this._operation.length === 0) {
                this._number = Math.sqrt(0)
            } else {
                this._number = Math.sqrt(this._operation[0])
            }
            this.showDisplay = this.setLastOperation(this._number)
        } else if (value === '**') {
            this._number = this._operation[0] ** 2
            this.showDisplay = this.setLastOperation(this._number)
        } else if (this._operation.length === 3) {
            this.calc()
        }
        if (this._operation[1] != undefined) this._operation.pop(this._operation[1])
        if (this._operation.length > 0 && value !== '1/' && value !== '√' && value !== '**') this._operation.push(this._operator = value)
    }

    arrNumber(value) {
        if (value === '.') {
            if (this._operation.length === 0 || this.isOperator(this.getLastOperation())) {
                this._operation.push(this._number = '0.')
            } else if (!this.getLastOperation().includes('.')) {
                this._number = this.getLastOperation() + value
            }
        } else if (value === '+-') {
            if (this._operation.length === 0) {
                return false
            } else if (Number(this.getLastOperation() > 0) && !this.getLastOperation().includes('-')) {
                this._number = '-' + this.getLastOperation()
            } else {
                this._number = this.getLastOperation().replace('-', '')
            }
        } else {
            if (this._operation.length === 0 || this.isOperator(this.getLastOperation())) {
                this._operation.push(this._number = value)
            } else {
                this._number = this.getLastOperation() + value
            }
        }
        this.showDisplay = this.setLastOperation(this._number)
    }

    addValue(value) {
        if(this.isOperator(value)) {
            this.arrOperator(value)
        } else {
            this.arrNumber(value)
        }
    }

    calc() {
        this._lastOperation = this.getResult()
        this._operation.splice(0, this._operation.length)
        this._operation.push(String(this._lastOperation))
        this.showDisplay = this._lastOperation
    }

    error() {
        return this.showDisplay = 'Error'
    }

    initPlayEvent() {
        document.querySelector('#btn-ce').addEventListener('dblclick', _=> {
            this.togglePlay()
        })
    }

    initButtonEvent() {
        this._buttons.forEach(btn => {
            btn.addEventListener('click', e => {
                this.playAudio()
                let value = e.srcElement.id.replace('btn-', '')

                switch (value) {
                    case 'ce':
                        this.cleanAll()
                        break
                    case 'Backspace':
                    case 'delete':
                        this.cleanEntry()
                        break
                    case 'equal':
                        this.calc()
                        break
                    case 'sum':
                        this.addValue('+')
                        break
                    case 'subtract':
                        this.addValue('-')
                        break
                    case 'divide':
                        this.addValue('/')
                        break
                    case 'multiply':
                        this.addValue('*')
                        break
                    case 'elevated':
                        this.addValue('**')
                        break
                    case 'percent':
                        this.addValue('%')
                        break
                    case 'root':
                        this.addValue('√')
                        break
                    case 'reverse':
                        this.addValue('1/')
                        break
                    case 'signal':
                        this.addValue('+-')
                        break
                    case 'point':
                        this.addValue('.')
                        break
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                        this.addValue(value)
                        break
                    default:
                        this.error()
                }
            })
        })
    }

    initKeyboardEvent() {
        window.addEventListener('keyup', e => {
            this.playAudio()

            switch (e.key) {
                case 'Escape':
                    this.cleanAll()
                    break
                case 'Backspace':
                case 'Delete':
                    this.cleanEntry()
                    break
                case '=':
                case 'Enter':
                    this.calc()
                    break
                case 'c':
                    if(e.ctrlKey) this.copyKeyboard()
                    break
                case '+':
                case '-':
                case '/':
                case '*':
                case '**':
                case '%':
                case '√':
                case '1/':
                case '+-':
                case '.':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                    this.addValue(e.key)
                    break
                default:
                    return false
            }
        })
    }

    get showDisplay() {
        return this._display.innerHTML
    }

    set showDisplay(value) {
        if(String(value).length > 11) {
            this.error()
            return false
        }

        this._display.innerHTML = value
    }
}