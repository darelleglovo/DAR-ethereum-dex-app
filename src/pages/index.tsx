import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import Button from "@mui/material/Button";
import Web3 from "web3";
import Identicon from "identicon.js";

import Token from "../abis/Token.json";
import EthSwapApp from "../abis/EthSwapApp.json";

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
import { useTheme } from "@emotion/react";

declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

const Home: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [ethBalance, setEthbalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [token, setToken] = useState({});
  const [ethSwapApp, setEthSwapApp] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState(0);
  const [input, setInput] = useState("");

  const handleInputChange = (event) => {
    setInput(event.target.value);
    const etherAmount = event.target.value;
    setOutput(etherAmount * 100);
  };

  const handleOnSwapClick = () => {
    setIsLoading(true);
    const etherAmount = window.web3.utils.toWei(input, "Ether");
    ethSwapApp.ethSwapApp.methods
      .buyTokens()
      .send({ value: etherAmount, from: account })
      .on("transactionHash", (hash) => {
        setIsLoading(false);
        window.location.reload();
      });
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
      mode: "dark",
    },
  });

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

    const networkId = await web3.eth.net.getId();

    if (account) {
      setEthbalance(await web3.eth.getBalance(account));

      // Load Token
      const tokenData = Token.networks[networkId];

      if (tokenData) {
        const token = new web3.eth.Contract(Token.abi, tokenData.address);
        setToken({ token });
        let tokenBalance = await token.methods.balanceOf(account).call();
        setTokenBalance(tokenBalance.toString());
      } else {
        window.alert("Token contract not deployed to detected network");
      }
    }

    // Load EthSwapApp
    const ethSwapAppData = EthSwapApp.networks[networkId];

    if (ethSwapApp) {
      const ethSwapApp = new web3.eth.Contract(
        EthSwapApp.abi,
        ethSwapAppData.address
      );
      setEthSwapApp({ ethSwapApp });
    } else {
      window.alert("EthSwapApp contract not deployed to detected network");
    }

    setIsLoading(false);
  };

  const MainCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    // width: "80vw",
    lineHeight: "60px",
    padding: 20,
  }));

  useEffect(() => {
    const init = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    init();
  }, [account]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              DAR-SwapApp
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
              color: darkTheme.palette.text.secondary,
            }}
          >
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={7} lg={4}>
                  <MainCard elevation={3}>
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs="auto">
                        <Typography>Input</Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography>
                          Balance: {window.web3.utils.fromWei(ethBalance)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <OutlinedInput
                      autoFocus
                      onChange={handleInputChange}
                      fullWidth
                      id="outlined-adornment-weight"
                      value={input}
                      endAdornment={
                        <InputAdornment position="end">ETH</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "ETH",
                        key: "123",
                      }}
                    />

                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs="auto">
                        <Typography>Output</Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography>
                          Balance: {window.web3.utils.fromWei(tokenBalance)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <OutlinedInput
                      disabled
                      fullWidth
                      id="outlined-adornment-weight"
                      value={output}
                      endAdornment={
                        <InputAdornment position="end">DAR</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "ETH",
                      }}
                    />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs="auto">
                        <Typography>Exchange Rate</Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography>1 ETH = 100 DAR</Typography>
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleOnSwapClick}
                    >
                      SWAP!
                    </Button>
                  </MainCard>{" "}
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;
