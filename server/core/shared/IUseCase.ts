export interface IUseCase<TInput, TOutput> {
	handle(input: TInput): TOutput;
}