import Head from "next/head";
import Sidebar from "../components/Sidebar";
import HomePage from "../pages/Home";

export default function Home() {
  return (
    <div>
      <Head>
        <title>G-Chats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </div>
  );
}
