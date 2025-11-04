import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { bitcoinBlocksData } from "../../utils/mock_data";
import Card from "../Card";
import BlockCardExpanded from "../blocks/BlockCardExpanded";
import BlockCardCollapsed from "../blocks/BlockCardCollapsed";

const Blocks = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  // Calculate blocks to show based on breakpoints
  const getCurrentBlocksToShow = () => {
    if (isXs) return 3;
    if (isSm) return 4;
    if (isMd) return 6;
    if (isLg) return 10;
    return 10;
  };

  const currentBlocksToShow = getCurrentBlocksToShow();
  const totalBlocks = bitcoinBlocksData.length;
  const maxScrollIndex = Math.max(0, totalBlocks - currentBlocksToShow);

  // Reset scroll when changing expansion state or breakpoint
  useEffect(() => {
    setScrollIndex(0);
  }, [isExpanded, isXs, isSm, isMd, isLg]);

  const handleScrollLeft = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1));
  };

  const visibleBlocks =
    currentBlocksToShow < totalBlocks
      ? bitcoinBlocksData.slice(scrollIndex, scrollIndex + currentBlocksToShow)
      : bitcoinBlocksData;

  return (
    <Box
      sx={{
        pb: 5,
        width: "100%",
        gridColumn: "1 / -1", // Span all columns
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "background.paper",
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Typography variant="caption" sx={{ mr: 5 }}>
              {isExpanded ? "- Collapse" : "+ Expand"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        {currentBlocksToShow < totalBlocks && (
          <>
            <IconButton
              onClick={handleScrollLeft}
              disabled={scrollIndex === 0}
              sx={{
                position: "absolute",
                left: { xs: -15, sm: -20 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "action.hover" },
                "&:disabled": { opacity: 0.3 },
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              <ChevronLeftIcon
                sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
              />
            </IconButton>
            <IconButton
              onClick={handleScrollRight}
              disabled={scrollIndex >= maxScrollIndex}
              sx={{
                position: "absolute",
                right: { xs: -15, sm: -20 },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "action.hover" },
                "&:disabled": { opacity: 0.3 },
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              <ChevronRightIcon
                sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
              />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {visibleBlocks.map((block) => (
            <Card
              key={block.id}
              sx={{
                backgroundColor: block.isPending ? "pending.main" : "#000000a3",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {isExpanded ? (
                <BlockCardExpanded block={block} />
              ) : (
                <BlockCardCollapsed block={block} />
              )}
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Blocks;
