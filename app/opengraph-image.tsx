import { ImageResponse } from "next/og";

export const alt =
  "b4joinacompany — Research a company before you apply, interview, or join";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const evidenceItems = [
  ["Reported", "Workplace stories", "#356c82"],
  ["Submitted", "Salary context", "#e9b44c"],
  ["Derived", "Questions to verify", "#14786e"],
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "58px 68px",
        color: "#16383d",
        backgroundColor: "#f3f7f6",
        backgroundImage:
          "linear-gradient(rgba(20,120,110,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(20,120,110,.055) 1px, transparent 1px)",
        backgroundSize: "34px 34px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-235px",
          right: "-105px",
          width: "560px",
          height: "560px",
          display: "flex",
          border: "2px solid rgba(20,120,110,.15)",
          borderRadius: "999px",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "13px",
              color: "#ffffff",
              backgroundColor: "#14786e",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            b4
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: "33px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            b4joinacompany
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: "10px 15px",
            border: "1px solid #b6cbc6",
            borderRadius: "999px",
            color: "#0d5d56",
            backgroundColor: "#ffffff",
            fontSize: "15px",
            fontWeight: 700,
          }}
        >
          Bangladesh company research
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: "970px" }}>
        <div
          style={{
            display: "flex",
            marginBottom: "18px",
            color: "#14786e",
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "2.3px",
            textTransform: "uppercase",
          }}
        >
          Before you apply, interview, or accept
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-3.6px",
          }}
        >
          Know the company before you say yes.
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "890px",
            marginTop: "21px",
            color: "#36565b",
            fontSize: "25px",
            lineHeight: 1.45,
          }}
        >
          Source-linked workplace evidence, salary context, work setup, and the
          questions you should verify.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          overflow: "hidden",
          border: "1px solid #b6cbc6",
          borderRadius: "14px",
          backgroundColor: "#ffffff",
        }}
      >
        {evidenceItems.map(([label, value, color], index) => (
          <div
            key={label}
            style={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "13px",
              padding: "17px 20px",
              borderRight:
                index === evidenceItems.length - 1
                  ? "0"
                  : "1px solid #d7e2df",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "42px",
                display: "flex",
                borderRadius: "999px",
                backgroundColor: color,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  color,
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "4px",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            color: "#587175",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          No company scores
        </div>
      </div>
    </div>,
    size,
  );
}
