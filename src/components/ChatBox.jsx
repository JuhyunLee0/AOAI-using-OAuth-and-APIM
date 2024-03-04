import React, { useState, useEffect } from 'react';
import lens from "../assets/lens.png";
import loadingGif from "../assets/loading.gif";
import ApimAoai from '../services/apim-aoai';

function ChatBox(props) {
    const [prompt, updatePrompt] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState(undefined);
  
    useEffect(() => {
      if (prompt != null && prompt.trim() === "") {
        setAnswer(undefined);
      }
    }, [prompt]);
    
    const sendPrompt = async (event) => {
        if (event.key !== "Enter") {
          return;
        }        
        const token = props.tokenObj.token;
        console.log('prompt', prompt);

        try {
          setLoading(true);
          const res = await ApimAoai.chatCompletion(props.tokenObj.token, "gpt-35-turbo", prompt);
          console.log('res', res);
          const message = res.choices[0].message.content;
          setAnswer(message);
        } catch (err) {
          console.error(err, "err");
        } finally {
          setLoading(false);
        }
    };


    return (
        <div className="spotlight__wrapper">
            <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything..."
            disabled={loading}
            style={{
                backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
            />
            <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
        </div>
    );
}


export default ChatBox;