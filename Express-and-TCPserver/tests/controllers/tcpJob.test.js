// Import the actual function to test
import { sendCodeToTcpClient } from "../../controllers/tcpJob.js";

// Mock the module
jest.mock("../../controllers/tcpJob.js", () => {
    // Define the mock functions inside the mock object
    const socketWrite = jest.fn().mockReturnValue("OK");
    const bufferToJson = jest.fn().mockImplementation((buffer) => JSON.parse(buffer));
    const isJsonBuffer = jest.fn().mockImplementation((buffer) => {
        try {
            JSON.parse(buffer);
            return true;
        } catch (e) {
            return false;
        }
    });

    return {
        sendCodeToTcpClient: jest.fn(),
        socketWrite,
        bufferToJson,
        isJsonBuffer,
    };
});

describe("sendCodeToTcpClient", () => {
    it("should send code to TCP client and receive JSON response", async () => {
        // Mock the implementation of sendCodeToTcpClient
        sendCodeToTcpClient.mockResolvedValue({ result: "OK" });

        const req = {
            body: {
                data: {
                    task: "someTask",
                    executeId: "someExecuteId",
                    code: "someCode",
                    programLanguage: "someLanguage",
                },
            },
        };

        // Define the expected data
        const dataToSend = { result: "OK" };

        const result = await sendCodeToTcpClient(req);

        // Check if the result matches the expected data
        expect(result).toEqual(dataToSend);
    });
});
