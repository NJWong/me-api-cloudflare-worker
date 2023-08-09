type Req = {
	method: string;
	headers: Record<string, string>;
	body: string;
	cache?: RequestCache;
};
