#include <iostream>

int main() {
    std::cout << "test gcc image";
    return 0;

}

//docker run -it -v /Users/zhongkuo/Desktop/Back-End-Class-Batch19/Zenv/TCPclient/test/testPL:/app gcc:12 sh -c "g++ /app/cpp.cpp -o /app/cpp && /app/cpp"