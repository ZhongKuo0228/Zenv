import { plServiceItems } from "../../models/db-PLcode.js";

// Mock pool.query
jest.mock("../../models/DBpool.js", () => ({
    __esModule: true,
    default: {
        query: jest.fn().mockResolvedValue([
            [
                { id: 1, name: "JavaScript", service_type: "prog_lang" },
                { id: 2, name: "Python", service_type: "prog_lang" },
            ],
        ]),
    },
}));

//unit test plServiceItems
describe("plServiceItems", () => {
    test("should return rows from the database", async () => {
        const expectedRows = [
            { id: 1, name: "JavaScript", service_type: "prog_lang" },
            { id: 2, name: "Python", service_type: "prog_lang" },
        ];

        const result = await plServiceItems();

        expect(result).toEqual(expect.arrayContaining(expectedRows));
    });
});
