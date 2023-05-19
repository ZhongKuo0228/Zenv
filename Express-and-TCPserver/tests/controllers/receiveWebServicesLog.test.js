import { receiveWebServicesLog } from "../../controllers/receiveWebServicesLog.js";
import httpMocks from "node-mocks-http";
import { sendToQueue } from "../../models/queue.js";

jest.mock("../../models/queue.js");

describe("Test receiveWebServicesLog", () => {
    it("should send logs to queue and respond with status 200", async () => {
        const mockRequest = httpMocks.createRequest({
            method: "POST",
            url: "/receiveWebServicesLog",
            body: {
                key: "value",
            },
        });

        const mockResponse = httpMocks.createResponse();

        await receiveWebServicesLog(mockRequest, mockResponse);

        // Check if sendToQueue was called with the right arguments
        expect(sendToQueue).toHaveBeenCalledWith("logSort", mockRequest.body);

        // Check if the status code and the message are correct
        expect(mockResponse._getStatusCode()).toBe(200);
        expect(JSON.parse(mockResponse._getData())).toEqual({
            message: "Log received successfully.",
        });
    });
});
