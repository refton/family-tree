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
    let data = {}

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

// var data = {
//       name: "cliff",
//       age: "34",
//     }
//
// var jsonData = JSON.stringify(data);
//
// function download(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], {type: contentType});
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }
// download(jsonData, '/json.txt', 'text/plain');
// var script = document.currentScript;
// var fullUrl = script.src;
// console.log(fullUrl)
