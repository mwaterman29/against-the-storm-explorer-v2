//believe 4o plagiarized from https://stackoverflow.com/questions/49485073/detailed-explanation-for-this-function-needed
function uuid(): string
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
	{
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export { uuid };
