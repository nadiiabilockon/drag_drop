//Validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    return isValid
}

//autobind decorator 
function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    }
    return adjDescriptor
}

//ProjectList Class
class ProjectList {
    templeteElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type){
        this.templeteElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templeteElement.content, true)
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = ''
    }
}

//ProjectInput Class
class ProjectInput {
    templeteElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;


    constructor() {
        this.templeteElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templeteElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure()
        this.attach()
    }

    private getUserInput(): [string, string, number] | void {
        const enterdTitle = this.titleInputElement.value;
        const enterdDescription = this.descriptionInputElement.value;
        const enterdPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enterdTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enterdDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enterdPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert('Ivalid input, please try again!')
            return
        } else {
            return [enterdTitle, enterdDescription, +enterdPeople]
        }
    }

    private clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();

        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInput()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const projInput = new ProjectInput()