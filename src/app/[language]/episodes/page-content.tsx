"use client";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";

// create an episode type with nullable values
type Episode = {
  title: string | null;
  description: string | null;
  link: string | null;
  pubDate: string | null;
  image: string | null;
};

// display a list of podcast episodes fetch from an rss feed
export default function Episodes() {
  //const { t } = useTranslation("episodes");
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    // fetch episode list from rss feed https://anchor.fm/s/ef3de024/podcast/rss
    fetchEpisodes();
  }, []);

  function stripHtmlTags(str: string) {
    return str.replace(/<[^>]*>/g, "").replace(/&#39;/g, "'");
  }

  const fetchEpisodes = async () => {
    const response = await fetch("https://anchor.fm/s/ef3de024/podcast/rss");
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");
    if (items.length === 0) {
      return;
    }
    const episodes: Episode[] = Array.from(items).map((item) => {
      return {
        title: item?.querySelector("title")?.textContent ?? null,
        description:
          stripHtmlTags(
            item?.querySelector("description")?.textContent || ""
          ) ?? null,
        link: item?.querySelector("link")?.textContent ?? null,
        pubDate: item?.querySelector("pubDate")?.textContent ?? null,
        image:
          item?.getElementsByTagName("itunes:image")[0]?.getAttribute("href") ??
          null,
      };
    });
    setEpisodes(episodes);
  };

  // iterate through the episodes and display episodes in MUI list
  return (
    <Container>
      <List>
        {episodes.map((episode, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              {episode.image && (
                <Avatar
                  src={episode.image}
                  alt={episode.title ?? "Episode image"}
                />
              )}
            </ListItemAvatar>
            <ListItemText primary={episode.title} secondary={episode.pubDate} />
            <ListItemText primary={episode.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
