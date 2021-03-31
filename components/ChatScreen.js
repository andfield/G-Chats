import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AttachFileIcon from "@material-ui/icons/AttachFile"

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter()

  //Function for show message returns some jsx
  const showMessage = () => {
    
  }

  return (
    <Container>
      <Header>
        <Avatar />

        <HeaderInfo>
            <h3>Rec Email</h3>
            <p>Last Seen...</p>
        </HeaderInfo>
        <HeaderIcons>
            <IconButton>
                <AttachFileIcon />
            </IconButton>
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
          {/* Show message */}

          <EndOfMessage>

          </EndOfMessage>
      </MessageContainer>
    </Container>
  );
}

export default ChatScreen;
const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3{
        margin-bottom: 3px;
    }

    >p{
        font-size: 14px;
        color: grey;
    }

`; 

const HeaderIcons = styled.div``;

const MessageContainer = styled.div``;

const EndOfMessage = styled.div``;