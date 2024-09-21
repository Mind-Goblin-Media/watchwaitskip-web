"use client";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";

// create an episode type with nullable values
type Episode = {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  image?: string;
};

// display a list of podcast episodes fetch from an rss feed
export default function Episodes() {
  //const { t } = useTranslation("episodes");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const rssURL: string =
    process.env.NEXT_PUBLIC_PODCAST_RSS_URL ||
    "https://anchor.fm/s/ef3de024/podcast/rss";

  useEffect(() => {
    // fetch episode list from rss feed https://anchor.fm/s/ef3de024/podcast/rss
    fetchEpisodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stripHtmlTags(str: string) {
    return str.replace(/&#39;/g, "'");
  }

  const fetchEpisodes = async () => {
    const response = await fetch(rssURL);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");
    if (items.length === 0) {
      return;
    }
    const episodes: Episode[] = Array.from(items).map((item) => {
      console.log(item);
      return {
        title: item?.querySelector("title")?.textContent ?? "",
        description:
          stripHtmlTags(
            item?.querySelector("description")?.textContent || ""
          ) ?? "",
        link: item?.querySelector("link")?.textContent ?? "",
        pubDate: item?.querySelector("pubDate")?.textContent ?? "",
        image:
          item?.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ??
          "",
      };
    });
    setEpisodes(episodes);
  };

  const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: 0,
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: "transparent",
      cursor: "pointer",
    },
    "&:focus-visible": {
      outline: "3px solid",
      outlineColor: "hsla(210, 98%, 48%, 0.5)",
      outlineOffset: "2px",
    },
  }));

  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: theme.spacing(2),
    flexGrow: 1,
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  }));

  const StyledTypography = styled(Typography)({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  // iterate through the episodes and display episodes in MUI list
  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      <div>
        <Typography variant="h1" gutterBottom>
          Podcast Episodes
        </Typography>
        <Typography>Stay in the loop with our film reviews</Typography>
      </div>

      <Grid container spacing={2} columns={12}>
        {episodes.map((episode, index) => (
          <Grid item key={index} xs={12} md={6}>
            <StyledCard
              variant="outlined"
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 0 ? "Mui-focused" : ""}
            >
              <CardMedia
                component="img"
                alt="cover art"
                image={episode.image}
                aspect-ratio="16 / 9"
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              />
              <StyledCardContent>
                <Typography gutterBottom variant="caption" component="div">
                  {episode.pubDate}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {episode.title}
                </Typography>
                <StyledTypography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  <p
                    className="description"
                    dangerouslySetInnerHTML={{
                      __html: episode.description || "",
                    }}
                  />
                </StyledTypography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
