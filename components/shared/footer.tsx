import React from "react";

export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-muted-foreground text-center text-sm leading-loose text-balance md:text-left">
          Built by{" "}
          <a
            href="https://github.com/gidorah"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium underline underline-offset-4"
          >
            gidorah
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/gidorah/image-processing-service-client"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
