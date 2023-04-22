import { useState } from "react";
import Buttons from "./Buttons";

export default function TEST2() {
    const [isSignIn, setIsSign] = useState(false);
    return <Buttons bgColor={isSignIn ? "red" : "yellow"} w='100px'></Buttons>;
}
