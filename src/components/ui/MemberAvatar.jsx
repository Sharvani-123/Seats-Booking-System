import { batchColor, batchBg, getMemberInitials } from "../../utils";

const MemberAvatar = ({ member, size = 36, fontSize = 14 }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 3,
    background: batchBg(member.batch),
    border: `1px solid ${batchColor(member.batch)}40`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, color: batchColor(member.batch), fontSize,
    flexShrink: 0,
  }}>
    {getMemberInitials(member.name)}
  </div>
);

export default MemberAvatar;
