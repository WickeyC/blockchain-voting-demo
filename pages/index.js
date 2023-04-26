import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";

//Internal Import
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";
import image from "../assets/candidate-1.jpg";

const HOME = () => {
  const {
    getAllCandidateData,
    getAllVoterData,
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    isWalletConnected,
    candidateLength,
    currentAccount,
    voterLength,
  } = useContext(VotingContext);

  // useEffect(() => {
  //   checkIfWalletIsConnected();
  //   getAllCandidateData();
  //   getAllVoterData();
  // }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (isWalletConnected) {
      getAllCandidateData();
      getAllVoterData();
    }
  }, [isWalletConnected]);

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No Candidate : <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No Voter : <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 900000} />
            </small>
          </div>
        </div>
      )}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

export default HOME;
