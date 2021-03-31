import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from '../firebase'

function Message({user, message}) {
    const [userLoggedIn] = useAuthState(auth);
    return (
        <Container>
            <p>{message.message}</p>
        </Container>
    )
}

export default Message

const Container = styled.div``;