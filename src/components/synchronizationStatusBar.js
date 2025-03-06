import { Box, CircularProgress, Tooltip } from "@mui/material";
import { synchState } from "../constants/synchState";
import { Help, Error, CheckCircle } from "@mui/icons-material";
import logger from "../logger/logger";

const getIcon = (state, dataName) => {
  switch (state) {
    case synchState.UNKNOWN:
      return (
        <Tooltip title={`${dataName} status unknown`}>
          <Help fontSize="small" sx={{ fill: "orange" }} />
        </Tooltip>
      );
    case synchState.FETCHING:
      return (
        <Tooltip title={`Fetching ${dataName}`}>
          <CircularProgress size="1rem" />
        </Tooltip>
      );
    case synchState.SENDING:
      return (
        <Tooltip title={`Sending ${dataName}`}>
          <CircularProgress size="1rem" />
        </Tooltip>
      );
    case synchState.SYNCHED:
      return (
        <Tooltip title={`${dataName} is up to date`} color="green">
          <CheckCircle fontSize="small" sx={{ fill: "green" }} />
        </Tooltip>
      );
    case synchState.ERROR:
      return (
        <Tooltip title={`${dataName} synchronization failed`}>
          <Error fontSize="small" sx={{ fill: "red" }} />
        </Tooltip>
      );
    default:
      logger.error(`Unknown state ${state}`);
  }
};

export default function SynchronizationStatusBar({
  shoppingCartState,
  articlesState,
}) {
  return (
    <Box display={"flex"}>
      {getIcon(shoppingCartState, "Shopping Cart")}
      {getIcon(articlesState, "Articles list")}
    </Box>
  );
}
