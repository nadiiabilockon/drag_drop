//Component Base Class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templeteElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string,
        hostELId: string,
        insertAtStart: boolean,
        newElId?: string
    ) {
        this.templeteElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostELId)! as T;

        const importedNode = document.importNode(
            this.templeteElement.content,
            true
        );
        this.element = importedNode.firstElementChild as U;

        if (newElId) {
            this.element.id = newElId;
        }
        this.attach(insertAtStart);
    }

    private attach(inserBeginning: boolean) {
        this.hostElement.insertAdjacentElement(
            inserBeginning ? "afterbegin" : "beforeend",
            this.element
        );
    }

    abstract configure(): void;
    abstract renderContent(): void;
}