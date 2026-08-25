import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components/button";

function SignatureIcon() {
  return (
    <svg
      data-slot="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
    </svg>
  );
}

export function WallButton() {
  return (
    <Button href="/wall" style={styles.button}>
      <SignatureIcon />
      See the signature wall
    </Button>
  );
}

const styles = stylex.create({
  button: {
    justifyContent: {
      default: "flex-start",
      "@media (min-width: 640px)": "center",
    },
  },
});
