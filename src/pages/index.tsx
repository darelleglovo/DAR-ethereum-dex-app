import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import Button from "@mui/material/Button";
import Web3 from "web3";
import Identicon from "identicon.js";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  styled,
  createTheme,
  ThemeProvider,
  Paper,
  Box,
  Grid,
  TextField,
  InputAdornment,
  OutlinedInput,
  Avatar,
} from "@mui/material";

declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

const Home: NextPage = () => {
  const [account, setAccount] = useState("");
  const [ethBalance, setEthbalance] = useState("0");

  const darkTheme = createTheme({ palette: { mode: "dark" } });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts[0]);

    setEthbalance(await web3.eth.getBalance(accounts[0]));
  };

  const MainCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    // height: "40vh",
    width: "80vw",
    lineHeight: "60px",
    padding: 20,
  }));

  useEffect(() => {
    const init = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    init();
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              EthSwapApp
            </Typography>
            <Typography variant="subtitle2" color="inherit" component="div">
              {account}
            </Typography>
            {account ? (
              <Avatar
                alt="acc"
                src={`data:image/png;base64,${new Identicon(
                  account,
                  30
                ).toString()}`}
                sx={{ width: 30, height: 30 }}
                style={{ marginLeft: 10 }}
              />
            ) : null}
          </Toolbar>
        </AppBar>

        <Box
          className={styles.container}
          sx={{
            p: 2,
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Head>
            <title>Welcome to EthSwapApp</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Box
            className={styles.main}
            sx={{
              p: 2,
              bgcolor: "background.default",
              display: "flex",
              gridTemplateColumns: { md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <MainCard elevation={3}>
              <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs="auto">
                  <Typography>Input</Typography>
                </Grid>
                <Grid item xs="auto">
                  <Typography>Balance: {ethBalance}</Typography>
                </Grid>
              </Grid>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-weight"
                value={0}
                // onChange={handleChange('weight')}
                endAdornment={
                  <InputAdornment position="end">ETH</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "ETH",
                }}
              />

              <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs="auto">
                  <Typography>Output</Typography>
                </Grid>
                <Grid item xs="auto">
                  <Typography>Balance: 0</Typography>
                </Grid>
              </Grid>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-weight"
                value={0}
                // onChange={handleChange('weight')}
                endAdornment={
                  <InputAdornment position="end">DAR</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "ETH",
                }}
              />
              <Button fullWidth variant="contained">
                SWAP!
              </Button>
            </MainCard>
          </Box>

          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{" "}
              <span className={styles.logo}>
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={72}
                  height={16}
                />
              </span>
            </a>
          </footer>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;
