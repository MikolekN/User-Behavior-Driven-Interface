
interface LabelProps {
    label: string;
}

const Label = ({ label }: LabelProps) => {
    return (
        <label className="font-semibold text-gray-700 block">{label}</label>
    )
};

export default Label;
