const Database = require("../db");

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
}

function selectRandomItems(arr = [], numItems = arr.length) {
    numItems = Math.min(numItems, arr.length);
  
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Create a shuffled copy of the array
    return shuffled.slice(0, numItems);
}

class Question {
    // A unique ID for every question
    id;
    
    // 4 answers in total
    answers = [];

    // Which index is right?
    correct;
    correctID;

    // The type of question
    type;

    constructor(id, sorts, type) {
        this.id = id;
        this.answers = selectRandomItems(sorts, 4);

        // This question expires after 5 minutes automatically
        setTimeout(() => {
            QuestionStore.DeleteQuestion(id);
        }, 1000 * 60 * 5);

        this.type = type;
    }

    // Get the names of all of the sorting algorithms (plus an implementation for the answer)
    async Names() {
        // Get ALL the info about the question (except the answer)
        let list = this.answers.map(a=>"?").join(",");
        const result = await Database.Query("SELECT id, name, implementation FROM `algorithms` WHERE id IN (" + list + ");", this.answers);

        this.correct = Math.floor(Math.random() * result.length);
        this.correctID = result[this.correct].id;

        return {
            answers: result.map(a=>a.name),
            implementation: result[this.correct].implementation,
            id: this.id
        }
    }

    // `answer` is the index of the answer
    async Answer(answer) {
        // Is it correct?
        const correct = parseInt(answer) === this.correct;

        // Get the explanation
        const result = await Database.Query("SELECT description FROM `explanations` WHERE type=? AND sort_id=?", [this.type, this.correctID]);

        return {
            correct,
            explanation: result[0]?.description || "Could not find explanation",
            result: this.answers.map((_, i)=>i==this.correct)
        }
    }

    // Get the introduction texts (if any)
    async Introductions(seen) {
        const seenPlaceholders = seen.map(() => '?').join(',');
        const sortPlaceholders = this.answers.map(() => '?').join(',');

        const query = `
            SELECT id, description, title
            FROM explanations
            WHERE ${seenPlaceholders.length ? `id NOT IN (${seenPlaceholders})` : "1"}
            AND type=?
            AND sort_id IN (${sortPlaceholders})
        `;

        const result = await Database.Query(query, [...seen, this.type, ...this.answers]);
        return [
            result.map(({ id, description, title }) => ({ description, title })),
            result.map(({ id, description, title }) => (id))
        ];
    }
}

class QuestionStore {
    static questions = [];

    // Register a question (expires in 5 seconds if nothing is done with it)
    static async RegisterQuestion(req, res) {
        // Generate a random ID (that has not been taken)
        let id;
        do {
            id = generateRandomString(5);
        } while (this.questions.reduce((a, b)=>a || (b.id == id), false));

        // Get the question
        const { sorts, type } = req.body;
        const question = new Question(id, sorts, type);
        
        // Add it to the list
        this.questions.push(question);

        /* TODO: Implement this using progress */

        // Get the question data and introductions (if applicable)
        const data = await question.Names();
        //const introductions = await question.Introductions(seen);

        res.json([data, [
            [],
            []
        ]]);
    }

    // Delete a question
    static DeleteQuestion(id) {
        this.questions = this.questions.filter(a=>a.id != id);
    }

    // Answer a question
    static async AnswerQuestion(req, res) {
        const { id, answer } = req.body;

        // Get the question
        const question = this.questions.find(a=>a.id == id);
        
        // Get the data about the answer
        const data = await question.Answer(answer);

        // Delete the question
        this.DeleteQuestion(question);

        res.json(data);
    }
}

module.exports = QuestionStore;
