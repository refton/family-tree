function listIncludes(list, element) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].equals(element)) {
            return true
        }
    }

    return false
}

function convert(obj) {
    return Object.keys(obj).map(key => ({
        id: parseInt(key),
        name: obj[key]
    }));
}

function checkMarriages (person, siblings) {
    let partners = []
    for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].includes(person)) {
            if (siblings[i][0] === person) {
                partners.push(siblings[i][1])
            }
            else {
                partners.push(siblings[i][0])
            }
        }
    }

    return partners
}

function findParents(person, parents) {
    for (let i = 0; i < parents.length; i++) {
        if (parents[i][0] === person) {
            return [parents[i][1], parents[i][2]]
        }
    }

    return []
}

/**
 *
 * @param {int} person - Person for serching ID
 * @param {array} listPersonParam - List with params where ID's value searching
 * @returns {*[]}
 *
 */
function findParamById(person, listPersonParam) {
    for (let i = 0; i < listPersonParam.length; i++) {
        if (listPersonParam[i][0] === person) {
            return [listPersonParam[i][1]]
        }
    }

    return []
}

/**
 *
 * @type {{dictionary}} data - Data from Google Sheets, where you fill parents information
 */
let data = {}

let persons = data['persons']
persons = convert(persons)
let siblings = data['siblings']
let parents = data['parents']
let otherSurname = data['otherSurname']
let birthDate = data['birthDate']
let depthDate = data['depthDate']
let nodesList = []

for (let i = 0; i < persons.length; i++) {
    let node = '{"id": ' + '' + i + '' + ','

    let partners = checkMarriages(i, siblings)
    if (partners.length > 0) {
        node = node + '"pids": ' + '[' + partners + ']' + ','
    }

    let persParents = findParents(i, parents)
    if (persParents.length > 0) {
        node = node + '"mid":' + persParents[0] + ',"fid":' + persParents[1] + ','
    }

    let persOtherSurname = findParamById(i, otherSurname)
    if (persOtherSurname.length > 0) {
        node = node + '"otherSurname": "' + persOtherSurname[0] + '",'
    }

    let persBirthDate = findParamById(i, birthDate)
    if (persBirthDate.length > 0) {
        node = node + '"birthDate": "' + persBirthDate[0] + '",'
    }

    let persDepthDate = findParamById(i, depthDate)
    if (persDepthDate.length > 0) {
        node = node + '"depthDate": "' + persDepthDate[0] + '",'
    }

    node = node + '"name":' + '"' +  persons[i]['name'] + '"' + ','

    let otchestvo = persons[i]['name'].split(' ')[2]
    console.log(otchestvo)
    try {
        var gender = petrovich.detect_gender(otchestvo)
        console.log(gender)
    }
    catch (error) {
        console.log('There is a mistake while trying to get gender by this otchestvo: ' + otchestvo + ", mistake:")
        console.log(error)
        var gender = undefined
    }
    node = node + '"gender":' + '"' +  gender + '"' + '}'

    nodesList.push(JSON.parse(node))
    console.log(nodesList)
}

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
        field_3: 'depthDate',
        field_4: 'placeOfBorn'
    },
    nodes: nodesList
});
