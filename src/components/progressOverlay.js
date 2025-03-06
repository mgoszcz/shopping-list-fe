import { Backdrop, CircularProgress } from "@mui/material";

export function ProgressOverlay({ loading }) {
  {
    return (
      loading && (
        <Backdrop
          open={loading}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000, // Ensures it appears above content
          }}
        >
          <CircularProgress size="6rem" />
        </Backdrop>
      )
    );
  }
}
