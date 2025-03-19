import Button from "../button/Button";
import IconButton from "../button/IconButton";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    return (
        <header>
            <IconButton icon={faUser} size="small" color="blue" title="User" /> <br />

            <Button icon={faUser} iconPosition="right" size="large" color="red" title="test">이요옹..</Button>
        </header>
    );
}