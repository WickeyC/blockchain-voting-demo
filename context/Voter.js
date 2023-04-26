import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//Internal Import
import { VotingAddress, VotingAddressABI } from "./constants";

//TODO: MOVE THESE TO .ENV
const projectId = "2OrKTWS4xQkftL2sUdXywL3aMG8";
const projectSecret = "f0772e5f5a2c12f7ab7321e66a6457f1";
//2OrKTWS4xQkftL2sUdXywL3aMG8:f0772e5f5a2c12f7ab7321e66a6457f1
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const subdomain = "https://blockchain-election.infura-ipfs.io";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: "5001",
  protocol: "https",
  headers: {
    authorization,
  },
});

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [votingTitle, setVotingTitle] = useState("Blockchain Voting app");
  const router = useRouter();

  //CANDIDATE DATA
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState(0);
  // const [candidateAddress, setCandidateAddress] = useState([]);
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  //END OF CANDIDATE DATA

  const [error, setError] = useState("");
  const highestVote = [];

  //VOTER DATA
  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState(0);
  const [voterAddress, setVoterAddress] = useState([]);
  //END OF VOTER DATA

  //CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please install MetaMask first.");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setIsWalletConnected(true);
    } else {
      setError("Connect with Metamask first.");
    }
  };

  //CONNECT WALLET
  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please install MetaMask first.");

    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(account[0]);
  };

  //UPLOAD TO IPFS VOTER IMAGE
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;

      return url;
    } catch (error) {
      setError("Error uploading file to IPFS");
    }
  };

  //UPLOAD TO IPFS CANDIDATE IMAGE
  const uploadToIPFSCandidate = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;

      return url;
    } catch (error) {
      setError("Error uploading file to IPFS");
    }
  };

  //CREATE VOTER
  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position) {
        return setError("Input data is missing");
      }

      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //console.log(contract);

      const data = JSON.stringify({ name, address, position, image: fileUrl });

      const added = await client.add(data);

      const ipfs = `${subdomain}/ipfs/${added.path}`;

      const voter = await contract.addVoter(address, name, fileUrl, ipfs);
      voter.wait();
      console.log(voter);
      router.push("/voterList");
    } catch (error) {
      setError("Something went wrong in creating voter");
    }
  };

  //GET VOTER
  const getAllVoterData = async () => {
    try {
      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //console.log(contract);

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      const voterDataPromises = voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        return singleVoterData;
      });

      const voterData = await Promise.all(voterDataPromises);
      setVoterArray(voterData);

      //VOTER LENGTH
      const voterLength = await contract.getVoterCount();
      setVoterLength(voterLength.toNumber());
    } catch (error) {
      console.log("Error");
      setError("Something went wrong in fetching data.");
    }
  };

  // useEffect(() => {
  //   console.log("voterLength has changed:", voterLength);
  // }, [voterLength]);

  // console.log(voterLength);

  // console.log(voterAddress);
  // useEffect(() => {
  //   getAllVoterData();
  // }, []);

  //GIVE VOTE
  const giveVote = async (id) => {
    try {
      //CONNECTING SMART CONTRACT
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterList = await contract.castVote(voterAddress, voterId);
      console.log(voterList);
    } catch (error) {
      console.log(error);
    }
  };

  //CREATE CANDIDATE
  const createCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) {
        return setError("Input data is missing");
      }

      console.log(name, address, age, fileUrl);

      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, age, image: fileUrl });

      const added = await client.add(data);

      const ipfs = `${subdomain}/ipfs/${added.path}`;

      const candidate = await contract.addCandidate(
        address,
        name,
        fileUrl,
        ipfs
      );
      candidate.wait();

      console.log(candidate);

      router.push("/");
    } catch (error) {
      setError("Something went wrong in creating candidate");
    }
  };

  //GET CANDIDATE DATA
  const getAllCandidateData = async () => {
    try {
      //CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      // console.log(contract);
      // console.log(contract.getCandidateList());

      const candidateListData = await contract.getCandidateList();
      // console.log(candidateListData);
      // setCandidateAddress(candidateListData);

      const candidateDataPromises = candidateListData.map(async (el) => {
        const singleCandidateData = await contract.getCandidateData(el);
        // pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[1].toNumber());
        // console.log(singleCandidateData);
        return singleCandidateData;
      });

      const candidateData = await Promise.all(candidateDataPromises);
      setCandidateArray(candidateData);

      // console.log(candidateArray);

      //CANDIDATE LENGTH
      const candidateLength = await contract.getCandidateCount();
      setCandidateLength(candidateLength.toNumber());
    } catch (error) {
      setError("Something went wrong in fetching data.");
    }
  };

  // useEffect(() => {
  //   getAllCandidateData();
  // }, []);

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        isWalletConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        createCandidate,
        getAllCandidateData,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateArray,
        candidateLength,
        // candidateAddress,
        uploadToIPFSCandidate,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

const Voter = () => {
  return <div>Voter</div>;
};

// export default Voter;
