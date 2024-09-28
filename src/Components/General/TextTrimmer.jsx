export default function TextTrimmer({ text, maxLength, className,style }) {
	const truncatedText = text
		? text.length > maxLength
			? text.slice(0, maxLength) + '...'
			: text
		: '';

	const handleCopy = (event) => {
		event.preventDefault();
		const clipboardData = event.clipboardData;
		clipboardData.setData('text', text);
	};

	return (
		<p
			className={className}
			style={{...style, textAlign:'start', whiteSpace: 'normal', textOverflow: 'clip', cursor: 'text' }}
			onCopy={handleCopy}
		>
			{truncatedText}
		</p>
	);
}