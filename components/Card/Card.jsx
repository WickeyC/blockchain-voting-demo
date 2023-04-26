import React from "react";
import Image from "next/image";

//Internal Import
import Style from "./Card.module.css";
// import image from "../../candidate.png";
import images from "../../assets";

const card = ({ candidateArray, giveVote }) => {
  return (
    <div className={Style.card}>
      {candidateArray.map((el, i) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[2]} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[0]} #{el[1].toNumber()}
            </h2>
            <p>Address: {el[4].slice(0, 30)}..</p>
            <p className={Style.total}>Total Vote</p>
          </div>

          <div className={Style.card_vote}>
            <p>{el[3].toNumber()}</p>
          </div>

          <div className={Style.card_button}>
            <button
              onClick={() => giveVote({ id: el[1].toNumber(), address: el[4] })}
            >
              Give Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default card;
