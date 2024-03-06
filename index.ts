import express, { Express, Request, Response } from "express"
import 'dotenv/config'

type QuestionType = {
	id: string;
	name: string;
	type: string;
	value: string;
}
type ResponseType = { // Purposely leaving out calculations, urlParemeters, quiz, and documents since those were not defined or included in the test data.
	questions: QuestionType[];
	submissionId: string;
	submissionTime: string;
}
type FilloutQueryDataType = {
	responses: ResponseType[];
	totalResponses: number;
	pageCount: number;
}
type ResponseFilterType = {
	id: string;
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
	value: number | string;
}
type ConditionType = {
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than',
	value: number | string
}
type ConditionsMapType = {
	[key: string]: ConditionType[] | [];
}
const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/:formId/filteredResponses", async (req: Request, res: Response) => {

	const RESPONSES_PER_PAGE: number = 150; // Based on the documentation, the maximum number of responses per page is 150.

	// Rewrite the formId to the hard-coded value to satisfy the constraints of this test/assignment.
	await fetch(`https://api.fillout.com/v1/api/forms/${req.params.formId}/submissions`,
		{
			headers: {
				Authorization: `Bearer ${process.env.FILLOUT_KEY}`
			}
		})
		.then(response => response.json())
		.then((data: FilloutQueryDataType) => {

			if (!data || !data.responses) throw new Error("Something went wrong, please try again later.");

			console.log(data);
			// for (let i = 0; i < data.responses.length; i++) {
			// 	console.log(data.responses[i].questions);
			// }

			if (!req.query || !req.query.filters) {
				res.json(data); // If no filters are provided, return all responses.
				return
			}
			console.log("req.query.filters: ", req.query.filters);
			const filters: ResponseFilterType[] = JSON.parse(req.query.filters as string);

			const responses: ResponseType[] = data.responses;
			let filteredResponses: ResponseType[] = [];

			// Map out of the conditions to avoid having to iterate over them for every question.
			let conditionsMap: ConditionsMapType = {}
			for (let i = 0; i < filters.length; i++) {
				const condition: ConditionType = {
					condition: filters[i].condition,
					value: filters[i].value
				}
				if (!conditionsMap[filters[i].id]) conditionsMap[filters[i].id] = [];
				(conditionsMap[filters[i].id] as Array<ConditionType>).push(condition);
			}

			// Iterate through and filter the responses.
			for (let i = 0; i < responses.length; i++) {
				// console.log(responses[i].questions);
				let responseIsValid: boolean = true;
				for (let j = 0; j < responses[i].questions.length; j++) {
					const question: QuestionType = responses[i].questions[j];
					// console.log("question: ", question);
					if (conditionsMap[question.id] && !checkCondition(question, conditionsMap[question.id])) {
						responseIsValid = false;
						break;
					}
				}
				if (responseIsValid) filteredResponses.push(responses[i]);
			}

			const filtered: FilloutQueryDataType = {
				responses: filteredResponses,
				totalResponses: filteredResponses.length,
				pageCount: Math.floor(filteredResponses.length / RESPONSES_PER_PAGE) + 1
			}
			// console.log("filtered: ", filtered);
			res.json(filtered);
		})
		.catch((error: Error) => {
			// TODO-: Handle based on error type if needed.
			console.log("Error: ", error);
			res.send("Something went wrong, please try again later.");
		})
});

function checkCondition(question: QuestionType, conditions: ConditionType[]): boolean {
	for (let i = 0; i < conditions.length; i++) {
		switch (conditions[i].condition) {
			case 'equals':
				if (question.value !== conditions[i].value) return false;
				break;
			case 'does_not_equal':
				if (question.value === conditions[i].value) return false;
				break;
			case 'greater_than':
				if (question.value === null && conditions[i].condition !== "does_not_equal") return false;
				if (!isDate(question.value)) {
					if (question.value <= conditions[i].value) return false;
				} else {
					const questionDate: Date = new Date(question.value);
					const conditionDate: Date = new Date(conditions[i].value as string);
					if (questionDate.getTime() <= conditionDate.getTime()) return false;
				}
				break;
			case 'less_than':
				if (question.value === null && conditions[i].condition !== "does_not_equal") return false;
				if (!isDate(question.value)) {
					if (question.value >= conditions[i].value) return false;
				} else {
					const questionDate: Date = new Date(question.value);
					const conditionDate: Date = new Date(conditions[i].value as string);
					if (questionDate.getTime() >= conditionDate.getTime()) return false;
				}
				break;
			default:
				return false;

		}
	}
	return true;
}

function isDate(str: string): boolean {
	const date: number = Date.parse(str);
	return !isNaN(date);
}

app.listen(port, () => {
	console.log(`Fillout app listening on port ${port}`)
});