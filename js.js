class Person {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.pids = []
        this.setGender()
    }

    /**
     * It's necessary to find pairs where {this.id} includes, and add partners to class object
     * @param {*[]} siblings - List with pairs of siblings
     */
    findMarriages(siblings) {
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i].includes(this.id)) {
                if (siblings[i][0] === this.id) {
                    this.pids.push(siblings[i][1])
                }
                else {
                    this.pids.push(siblings[i][0])
                }
            }
        }
        if (this.pids.length === 0) {
            delete this.pids
        }
    }

    /**
     *
     * @param {*[]} parents - List with data about child ID, and his parents: [child, parent1, parent2]
     */
    findParents(parents) {
        for (let i = 0; i < parents.length; i++) {
            if (parents[i][0] === this.id) {
                this.mid = parents[i][1]
                this.fid = parents[i][2]
            }
        }
    }

    /**
     * Method that helping to set other data for class object
     * @param {*[]} dataList - List with params where ID's value searching
     */
    setParam(dataList) {
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i][0] === this.id) {
                return [dataList[i][1]]
            }
        }
    }

    setGender() {
        let otchestvo = this.name.split(' ')[2]

        let gender
        try {
            gender = petrovich.detect_gender(otchestvo)
        }
        catch (error) {
            console.log('There is a mistake while trying to get gender by this otchestvo: ' + otchestvo + ", mistake:")
            console.log(error)
            gender = undefined
        }

        if (gender !== undefined) {
            this.gender = gender
        }

    }
}

function convert(obj) {
    return Object.keys(obj).map(key => ({
        id: parseInt(key),
        name: obj[key]
    }));
}

function workWork() {
    /**
     *
     * @type {{dictionary}} data - Data from Google Sheets, where you fill parents information
     */
    let data = {
        persons: {
            0: 'Иванов Николай Николаевич',
            1: 'Иванова Нина Владимировна',
            2: 'Иванов Александр Николаевич',
            3: 'Иванова Марина Вячеславовна',
            4: 'Иванов Владислав Александрович',
            5: 'Иванова Ольга Антоновна',
            6: 'Иванов Алексей Владиславович',
            7: 'Иванова Василиса Владиславовна',
            8: 'Березин Антон Сергеевич',
            9: 'Гамаюнова Екатерина Борисовна',
            10: 'Сигачев Владимир Алексеевич',
            11: 'Сигачева Маргарита Ильнична',
            12: 'Дейч Евгений Александрович',
            13: 'Ванеев Борис Васильевич',
            14: 'Андреева Галина Юрьевна',
            15: 'Дейч Антон Евгеньевич',
            16: 'Гамаюнов Андрей Васильевич',
            17: 'Гамаюнов Илья Андреевич',
            18: 'Гамаюнов Иван Андреевич',
            19: 'Шубина Татьяна Николаевна',
            20: 'Шубин Вячеслав Вальтерович',
            21: 'Зудерман Вальтер Арведович',
            22: 'Шубина Антонина',
            23: 'Сугробов Илья Саввич',
            24: 'Сугробова Мария',
            25: 'Сигачев Алексей',
        },
        siblings: [[0, 1], [8, 9], [3, 2], [4, 5], [10, 11], [14, 12], [14, 13], [16, 9], [19, 20], [23, 24], [22, 21],],
        parents: [[5, 8, 9], [7, 4, 5], [6, 4, 5], [4, 3, 2], [2, 0, 1], [9, 14, 13], [15, 14, 12], [1, 10, 11], [17, 16, 9], [18, 16, 9], [3, 19, 20], [11, 23, 24],],
        otherSurname: [[1, 'Сигачева'], [3, 'Шубина'], [5, 'Березина'], [9, 'Андреева'], [11, 'Сугробова'], [19, 'Алымова'],],
        birthDate: [[5, '1994-05-10'], [7, '2021-09-04'], [6, '2018-09-08'], [4, '1994-06-01'], [2, '1970-05-14'], [9, '1975-08-22'], [17, '2001-07-02'], [18, '2005-07-25'], [3, '1972-04-30'],],
        deathDate: [[10, '1998-01-01'],],
        birthPlace: [[5, 'Москва'], [7, 'Москва'], [6, 'Москва'], [4, 'Москва'], [2, 'Москва'], [9, 'Москва'], [17, 'Москва'], [18, 'Москва'], [3, 'Москва'],],
    }

    let persons = convert(data['persons'])
    let siblings = data['siblings']
    let parents = data['parents']
    let otherSurname = data['otherSurname']
    let birthDate = data['birthDate']
    let deathDate = data['deathDate']
    let birthPlace = data['birthPlace']
    let persons_list = []

    for (let i = 0; i < persons.length; i++) {
        persons_list.push(new Person(persons[i]['id'], persons[i]['name']))

        let currentPerson = persons_list[i]

        currentPerson.findMarriages(siblings)
        if (currentPerson.siblings === undefined) { delete currentPerson.siblings}

        currentPerson.findParents(parents)
        if (currentPerson.mid === undefined && currentPerson.fid === undefined) {
            delete currentPerson.mid
            delete currentPerson.fid
        }

        currentPerson.otherSurname = currentPerson.setParam(otherSurname)
        if (currentPerson.otherSurname === undefined) { delete currentPerson.otherSurname}

        currentPerson.birthDate = currentPerson.setParam(birthDate)
        if (currentPerson.birthDate === undefined) { delete currentPerson.birthDate}

        currentPerson.birthPlace = currentPerson.setParam(birthPlace)
        if (currentPerson.birthPlace === undefined) { delete currentPerson.birthPlace}

        currentPerson.deathDate = currentPerson.setParam(deathDate)
        if (currentPerson.deathDate === undefined) { delete currentPerson.deathDate}

    }
    console.log(persons_list)


    FamilyTree.templates.myTemplate = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.myTemplate_female = Object.assign({}, FamilyTree.templates.tommy_female);
    FamilyTree.templates.myTemplate_male = Object.assign({}, FamilyTree.templates.tommy_male);
    FamilyTree.templates.myTemplate_female.field_0 = '<text data-width="230" data-text-overflow="multiline"  style="font-size: 20px;" fill="#fff" x="125" y="40" text-anchor="middle">{val}</text>';
    FamilyTree.templates.myTemplate_female.field_1 = '<text data-width="230" data-text-overflow="ellipsis" style="font-size: 12px;" fill="#fff" x="125" y="80" text-anchor="middle">{val}</text>';
    FamilyTree.templates.myTemplate_male.field_0 = '<text data-width="230" data-text-overflow="multiline"  style="font-size: 20px;" fill="#fff" x="125" y="40" text-anchor="middle">{val}</text>';
    FamilyTree.templates.myTemplate_male.field_1 = '<text data-width="230" data-text-overflow="ellipsis" style="font-size: 12px;" fill="#fff" x="125" y="80" text-anchor="middle">{val}</text>';

    FamilyTree.templates.myTemplate_female.field_2 = '<text data-width="230" data-text-overflow="multiline"  style="font-size: 12px;" fill="#fff" x="15" y="110" text-anchor="start">{val}</text>';
    FamilyTree.templates.myTemplate_female.field_3 = '<text data-width="230" data-text-overflow="ellipsis" style="font-size: 12px;" fill="#fff" x="225" y="110" text-anchor="end">{val}</text>';
    FamilyTree.templates.myTemplate_male.field_2 = '<text data-width="230" data-text-overflow="multiline"  style="font-size: 12px;" fill="#fff" x="15" y="110" text-anchor="start">{val}</text>';
    FamilyTree.templates.myTemplate_male.field_3 = '<text data-width="230" data-text-overflow="ellipsis" style="font-size: 12px;" fill="#fff" x="225" y="110" text-anchor="end">{val}</text>';

    var family = new FamilyTree(document.getElementById("tree"), {
        mouseScrool: FamilyTree.action.none,
        template: "myTemplate",
        nodeBinding: {
            field_0: "name",
            field_1: "otherSurname",
            field_2: 'birthDate',
            field_3: 'deathDate',
        },
        editForm: {
            titleBinding: "name",
            photoBinding: "photo",
            generateElementsFromFields: false,
            addMore: 'Add more elements',
            addMoreBtn: 'Add element',
            addMoreFieldName: 'Element name',
            elements: [
                {type: 'textbox', label: 'Full Name', binding: 'name'},
                {type: 'date', label: 'Birth Date', binding: 'birthDate'},
                [
                    {type: 'date', label: 'Birth Dfrate', binding: 'birthrDate'},
                    {type: 'date', label: 'Death Date', binding: 'deathDate'}
                ],

                {type: 'textbox', label: 'Place of birth', binding: 'birthPlace'},
            ],
        },
        nodes: persons_list
    });

}

workWork()
