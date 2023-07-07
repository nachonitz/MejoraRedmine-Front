const Page = ( { children }: any ) => {

    return (
        <>
            <div className="p-page mt-10 box-border w-full">
                { children }
            </div>
        </>
    )
}

export default Page;