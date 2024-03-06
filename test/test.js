import { expect } from 'chai';

// NOTE: If the form data is changed, these tests could potentiallyj.
const FORM_ID = 'cLZojxk94ous';

describe('Checks equality for a number.', () => {
    const filters = [
        {
            "id": "fFnyxwWa3KV6nBdfBDCHEA",
            "condition": "equals",
            "value": 2
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(1)
            });
    });
});

describe('Checks inequality for a number.', () => {
    const filters = [
        {
            "id": "fFnyxwWa3KV6nBdfBDCHEA",
            "condition": "does_not_equal",
            "value": 100000
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(12)
            });
    });
});

describe('Checks range for a number.', () => {
    const filters = [
        {
            "id": "fFnyxwWa3KV6nBdfBDCHEA",
            "condition": "greater_than",
            "value": 0
        },
        {
            "id": "fFnyxwWa3KV6nBdfBDCHEA",
            "condition": "less_than",
            "value": 20
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(6)
            });
    });
});

describe('Checks equality for a string.', () => {
    const filters = [
        {
            "id": "kc6S6ThWu3cT5PVZkwKUg4",
            "condition": "equals",
            "value": "billy@fillout.com"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(2)
            });
    });
});

describe('Checks inequality for a string.', () => {
    const filters = [
        {
            "id": "kc6S6ThWu3cT5PVZkwKUg4",
            "condition": "does_not_equal",
            "value": "billy@fillout.com"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(11)
            });
    });
});

describe('Checks equality for a date.', () => {
    const filters = [
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "equals",
            "value": "2024-02-01"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(1)
            });
    });
});

describe('Checks inequality for a date.', () => {
    const filters = [
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "does_not_equal",
            "value": "2024-02-01"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(12)
            });
    });
});

describe('Checks range for a date.', () => {
    const filters = [
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "greater_than",
            "value": "2024-01-01"
        },
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "less_than",
            "value": "2024-12-31"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(9)
            });
    });
});

describe('Checks equality for a number, inequality for a stirng and range for a date.', () => {
    const filters = [
        {
            "id": "fFnyxwWa3KV6nBdfBDCHEA",
            "condition": "equals",
            "value": 2
        },
        {
            "id": "kc6S6ThWu3cT5PVZkwKUg4",
            "condition": "does_not_equal",
            "value": "alexi@fillout.com"
        },
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "greater_than",
            "value": "2024-01-01"
        },
        {
            "id": "dSRAe3hygqVwTpPK69p5td",
            "condition": "less_than",
            "value": "2024-12-31"
        }
    ];
    it('Query ', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(1)
            });
    });
});


describe('Should return all results.', () => {
    it('Queries without filters.', async () => {
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(13)
            });
    });
    it('Queries with a filter whose condition will not be met.', async () => {
        const filters = [
            {
                "id": "4KC356y4M6W8jHPKx9QfEy",
                "condition": "does_not_equal",
                "value": "a value that is guaranteed not to match" // This particular value should be null.
            }
        ];
        await fetch(`http://localhost:3000/${FORM_ID}/filteredResponses?filters=${encodeURIComponent(JSON.stringify(filters))}`)
            .then(response => response.json())
            .then((data) => {
                expect(data.responses.length).to.equal(13)
            });
    });
});