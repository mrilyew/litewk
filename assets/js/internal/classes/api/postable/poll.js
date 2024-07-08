class Poll extends PostLike {
    getQuestion() {
        return Utils.escape_html(this.info.question)
    }

    getAnswers() {
        return this.info.answers
    }
}
