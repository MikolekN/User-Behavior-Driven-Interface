
interface LabelProps {
    label: string;
}

const Label = ({ label }: LabelProps) => {
    return (
        <label className="font-medium text-black dark:text-gray-400 block">{label}</label>
    )
};

export default Label;
