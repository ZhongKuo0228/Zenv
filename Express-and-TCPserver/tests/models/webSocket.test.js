import { Server } from "socket.io";
import dotenv from "dotenv";
import { websSocket } from "../../models/webSocket.js";

// Mocking the environment variables
jest.mock("dotenv", () => ({
    config: jest.fn(),
}));

// Mocking the Server class
jest.mock("socket.io", () => ({
    Server: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
    })),
}));

describe("WebSocket", () => {
    let mockHttpServer;
    let mockLog;

    beforeAll(() => {
        // Mocking the environment variables
        process.env.FrontEnd = "http://example.com";
    });

    beforeEach(() => {
        // Clear the mock implementations and instances before each test
        Server.mockClear();
        dotenv.config.mockClear();

        // Creating a mock HTTP server
        mockHttpServer = {};

        // Mocking the console.log function
        mockLog = jest.spyOn(console, "log");

        // Calling the WebSocket function
        websSocket(mockHttpServer);
    });

    afterEach(() => {
        // Restore the original implementation of console.log after each test
        mockLog.mockRestore();
    });

    it("should create a socket.io server with the provided HTTP server and CORS options", () => {
        // Asserting that the Server constructor is called with the expected arguments
        expect(Server).toHaveBeenCalledWith(mockHttpServer, {
            cors: {
                origin: process.env.FrontEnd,
            },
        });
    });
});
