import React, { useState, useEffect } from "react";
import Anime from "react-anime";
import Chip from "@material-ui/core/Chip";
import CloseIcon from "@material-ui/icons/Close";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import SearchIcon from "@material-ui/icons/Search";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  TextField,
  InputAdornment,
  Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import clsx from "clsx";
import debounce from "debounce";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: 4,
    left: "50%",
    marginLeft: -160
  },
  card: {
    position: "fixed",
    bottom: 4,
    marginLeft: -12,
    zIndex: -1,
    maxWidth: 344,
    paddingBottom: 108
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2
  },
  closeButtonIcon: {
    width: 14,
    height: 14
  },
  closeButtonWhileBig: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 14,
    width: 14
  },
  collapsedTitle: {
    width: 270,
    height: 24,
    position: "relative"
  },
  collapsedTitleText: {
    width: 270,
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0
    // textOverflow: "ellipsis"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflowX: "scroll",
    "-ms-overflow-style": "none", // IE 10+
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      // Safari & Chrome
      display: "none"
    },
    position: "relative"
  },
  chip: {
    marginLeft: 5
  },
  chipLabel: {
    maxWidth: 180,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-block"
  },
  preview: {
    alignItems: "center",
    display: "flex",
    cursor: "pointer"
  },

  searchInput: {
    width: "100%"
  },
  title: {
    fontSize: 14
  },
  widget: {
    boxSizing: "border-box",
    padding: 10,
    boxShadow: "0px 0px 2px 2px rgba(200, 200, 200, 0.25)",
    borderRadius: 3,
    backgroundColor: "white",
    width: 320,
    marginBottom: 2,
    transition: "0.2s",
    overflowX: "scroll",
    "-ms-overflow-style": "none", // IE 10+
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      display: "none"
    }
  },
  widgetNoBorder: {
    border: "none",
    boxSizing: "border-box",
    padding: 10,
    backgroundColor: "white",
    width: 320,
    overflowX: "scroll",
    "-ms-overflow-style": "none", // IE 10+
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      display: "none"
    },
    marginBottom: 2
  },
  smallWidget: {
    transform: "scale(0.7)",
    marginBottom: 0,
    opacity: 0.8,
    "&:hover": {
      opacity: 1
    }
  },
  bigModeExtension: {
    marginTop: 4
  },
  bigChips: {
    display: "flex",
    flexDirection: "row",
    overflowX: "scroll",
    paddingBottom: 4,
    "-ms-overflow-style": "-ms-autohiding-scrollbar", // IE 10+
    // scrollbarWidth: "none", // Firefox
    scrollbarWidth: "thin", // Firefox
    scrollbarColor: "auto", //Firefox
    "&::-webkit-scrollbar": {
      height: 1
    },
    "&::-webkit-scrollbar-thumb": {
      background: "blue"
    },
    width: 300,
    marginTop: 8
    // "-webkit-overflow-scrolling": "touch",
    // webkitOverflowScrolling: "touch"
  }
});

const topics = [
  {
    title: "What's the risk free trial?",
    content: `We believe you should sleep on these products to decide if you like them, so we give you up to 100 nights to try them in your own home. If they don’t work out, returns are free and easy.`
  },
  {
    title: "Plush and firm - what's the difference?",
    content: `Both mattresses share the same quality base and construction. Plush mattresses are designed with an extra-soft topper that conforms to your body's shape for extra comfort. Firm mattresses use the same great base, but the big difference between a firm on soft mattress is the feel. A firm mattress is more rigid to the touch and has less give. A softer mattress will compress more easily when pressure is applied.`
  },
  {
    title: "How long will a mattress last?",
    content: `Our warranty will cover the mattress for 10 years so you can sleep soundly knowing you're covered.`
  },
  {
    title: "What mattress foundation should I use?",
    content: `The Snüz Mattress needs a strong and sturdy base! This can be a platform, box foundation, or an adjustable bed frame — it all works just fine. Keep in mind all slats should be 3" or less apart for the best support.`
  },
  {
    title: "What kind of mattress protector do I need?",
    content: `We recommend a mattress protector that has plenty of stretch allowing you to sink in properly and gain the full benefits of technology our mattresses have to offer.`
  },
  {
    title: "How long will it take for my order to arrive?",
    content: `For standard shipping, delivery times will vary. You can usually expect delivery of your ordered items within 3-7 business days by FedEx Ground, with delivery Monday through Friday, excluding holidays.`
  }
];

let timeoutId;
let numberOfScrolls = 0;
let horizontalScrollPosition;

const App = props => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const [chosenTopic, setChosenTopic] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState("normal");
  // store window X offset to determine whether < > nav icons should be visible
  // const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0);

  const reset = () => {
    setChosenTopic(null);
    setIsExpanded(false);
    setPreviewMode("normal");
    setPreviewIndex(0);
    numberOfScrolls = 0;
  };

  useEffect(() => {
    clearTimeout(timeoutId);
    if (previewMode !== "big" && !isExpanded) {
      timeoutId = setTimeout(() => {
        let nextPreviewIndex = previewIndex + 1;
        if (nextPreviewIndex >= topics.length) {
          // don't loop
          // nextPreviewIndex = 0;
          return;
        }
        setPreviewIndex(nextPreviewIndex);
      }, 10000);
    }
  }, [previewIndex, previewMode, isExpanded]);

  const scrolly = debounce(
    () => {
      numberOfScrolls++;
      if (numberOfScrolls === 1) {
        setPreviewMode("small");
      }
      // instead of resetting so we
      // collapse on scroll, make the
      // visitor close biggie mode
      // and then do not biggie again
      // on the same page
      if (numberOfScrolls === 8) {
        // numberOfScrolls = 0;
        setPreviewMode("big");
      }
    },
    200,
    true
  );

  useEffect(() => {
    window.addEventListener("scroll", scrolly);
    return function cleanup() {
      window.removeEventListener("scroll", scrolly);
    };
  }, []);

  let previewWidgetClassName;
  if (chosenTopic) {
    previewWidgetClassName = classes.widgetNoBorder;
  } else {
    previewWidgetClassName = clsx(
      classes.widget,
      previewMode === "small" && classes.smallWidget
    );
  }

  return (
    <div>
      {/* <button onClick={() => setPreviewMode("big")}>Grab Attention</button> */}
      <div className={classes.root}>
        {chosenTopic ? (
          <Slide
            direction="up"
            in={chosenTopic !== null}
            mountOnEnter
            unmountOnExit
          >
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary">
                  {chosenTopic.title}
                  <IconButton
                    className={classes.closeButton}
                    size="small"
                    onClick={reset}
                  >
                    <CloseIcon className={classes.closeButtonIcon} />
                  </IconButton>
                </Typography>

                <Typography
                  variant="body2"
                  component="p"
                  dangerouslySetInnerHTML={{ __html: chosenTopic.content }}
                ></Typography>
              </CardContent>
            </Card>
          </Slide>
        ) : null}
        <div className={previewWidgetClassName}>
          {!isExpanded && previewMode === "big" ? (
            <IconButton
              className={classes.closeButtonWhileBig}
              size="small"
              onClick={reset}
            >
              <CloseIcon className={classes.closeButtonWhileBig} />
            </IconButton>
          ) : null}

          <div className={classes.buttons}>
            {isExpanded || previewMode === "big" ? (
              <TextField
                className={classes.searchInput}
                placeholder="Ask questions here..."
                // autoFocus
                // removed due to keyboard taking up too much space on mobile
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            ) : (
              <div>
                <div
                  className={classes.preview}
                  onClick={() => {
                    setIsExpanded(true);
                    setChosenTopic(topics[previewIndex]);
                  }}
                >
                  <div className={classes.collapsedTitle}>
                    {topics.map((topic, index) => {
                      if (previewIndex === index) {
                        const animePropsIn = {
                          opacity: [0, 1],
                          easing: "easeInOutQuad",
                          duration: "750",
                          delay: (el, i) => 20 * (i + 1)
                        };
                        const animePropsOut = {
                          opacity: [1, 0],
                          easing: "easeOutExpo",
                          duration: "1000",
                          delay: "7000"
                        };
                        return (
                          <Typography
                            key={index}
                            className={classes.collapsedTitleText}
                            component="div"
                          >
                            {/* Math.random fixes a bug that was occurring on Anime re-rendering*/}
                            <Anime {...animePropsOut} key={Math.random()}>
                              <div>
                                <Anime {...animePropsIn} key={Math.random()}>
                                  {topic.title
                                    .split("")
                                    .map((character, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className="anime-letter"
                                        >
                                          {character}
                                        </span>
                                      );
                                    })}
                                </Anime>
                              </div>
                            </Anime>
                          </Typography>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                </div>
              </div>
            )}
          </div>

          {/* When the widget is auto expanded */}
          {previewMode === "big" || isExpanded ? (
            <div className={classes.bigModeExtension}>
              <Typography variant="caption" color="textSecondary">
                People ask:
              </Typography>
              <div className={classes.bigChips}>
                {/* <Anime
                  key={Math.random()}
                  translateX={[40, 0]}
                  translateZ={0}
                  opacity={[0, 1]}
                  easing={"easeOutExpo"}
                  duration={1700}
                  delay={(el, i) => 500 + 30 * i}
                > */}

                {/* <IconButton
                  // className={classes.closeButton}
                  size="small"
                  // onClick={reset}
                >
                  <NavigateBeforeIcon
                  // className={classes.closeButtonIcon}
                  />
                </IconButton> */}

                {/* {console.log(`horizontal scroll is: ${window.pageXOffset}`)} */}

                {topics.map((topic, index) => {
                  return (
                    <Chip
                      id={`chip-${index}`}
                      key={index}
                      className={classes.chip}
                      classes={{
                        label: classes.chipLabel
                      }}
                      label={topic.title}
                      variant={
                        chosenTopic && chosenTopic.title === topic.title
                          ? "default"
                          : "outlined"
                      }
                      onClick={() => {
                        // using refs is too hard b/c of react-anime
                        // messing with the refs
                        document
                          .getElementById(`chip-${index}`)
                          .scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            inline: "center"
                          });
                        setIsExpanded(true);
                        setChosenTopic(topic);
                      }}
                    />
                  );

                  //add navigation icons here?
                })}
                {/* </Anime> */}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
