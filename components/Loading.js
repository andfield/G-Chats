import {ThreeBounce} from "better-react-spinkit"

function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: "center", height:"100vh"}}>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <img src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" alt=""
        height={200}
        style={{marginBottom: 10}}
        />
        <ThreeBounce color="#4c27a3" size={30}/>
      </div>
    </center>
  );
}

export default Loading;
