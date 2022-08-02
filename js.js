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

function checkMarriges(person, siblings) {
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

let persons = {0: '0',1: '1',2: '2',3: '3',4: '4',5: '5',6: '6',7: '7',8: '8',9: '9',10: '10',11: '11',12: '12',13: '13',14: '14',15: '15',}
persons = convert(persons)
let siblings = [[0,1],[8,9],[3,2],[4,5],[10,11],[14,12],[14,13],]
let parents = [[5,8,9],[7,4,5],[6,4,5],[4,3,2],[2,0,1],[7,4,5],[9,14,13],[15,14,12],[1,10,11],]
let nodesList = []

for (let i = 0; i < persons.length; i++) {
    let node = '{"id": ' + '' + i + '' + ','

    let partners = checkMarriges(i, siblings)
    if (partners.length > 0) {
        node = node + '"pids": ' + '[' + partners + ']' + ','
    }

    let persParents = findParents(i, parents)
    if (persParents.length > 0) {
        node = node + '"mid":' + persParents[0] + ',"fid":' + persParents[1] + ','
    }

    node = node + '"name":' + '"' +  persons[i]['name'] + '"' + '}'

    nodesList.push(JSON.parse(node))
}

var family = new FamilyTree(document.getElementById("tree"), {
    mouseScrool: FamilyTree.action.none,
    nodeBinding: {
        field_0: "name"
    },
    nodes: nodesList
});
