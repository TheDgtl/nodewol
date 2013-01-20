window.DeviceView = Backbone.View.extend({
    initialize: function() {
        $(this.el).addClass("accordion-group");
        this.model.bind('change', this.update, this);
        this.model.bind('destroy', this.remove, this);
    },

    events: {
        'click .btn.details': 'toggleDetails',
        'click a.edit': 'edit',
        'keydown input': 'editKeyPress',
        'focusout input': 'cancelEdit',
        'click a.tower': 'typeTower',
        'click a.laptop': 'typeLaptop',
        'click a.desktop': 'typeDesktop',
    },

    toggleDetails: function() {
        if ( $(this.el).find("table").css("display") != "none" )
            $(this.el).find(".btn.details").html("Show details");
        else
            $(this.el).find(".btn.details").html("Hide details");

        $(this.el).find("table").fadeToggle();
    },

    edit: function() {
        this.$el.addClass("editing");
        this.$input.focus();
        this.$input.select();
    },

    cancelEdit: function() {
        this.$el.removeClass("editing");
        this.$input.attr('value', this.$editlink.html());
    },

    editKeyPress: function(e) {
        if ( e.which == 27 ) // Escape
        {
            this.cancelEdit();
        }
        else if ( e.which == 13 ) // Enter
        {
            this.model.set('name', this.$input.attr('value'));
            this.model.save();
            this.$el.removeClass("editing");
        }
    },

    typeTower: function() {
        this.model.set('type', 'tower');
        this.model.save();
    },

    typeLaptop: function() {
        this.model.set('type', 'laptop');
        this.model.save();
    },

    typeDesktop: function() {
        this.model.set('type', 'desktop');
        this.model.save();
    },

    update: function() {
        this.render( this.$el.find(".in").length != 0 );
    },

    render: function(inAllowed) {
        var thisdev = currdev !== undefined && currdev !== null && currdev.id == this.model.get('id');
        inAllowed = inAllowed === undefined ? thisdev : inAllowed;
        var details = ( this.$el.find(".btn.details").html() == "Hide details" )
        var templ = this.model.toJSON();

        this.$el.html(this.template(templ));

        if ( inAllowed ) this.$el.find(".accordion-body").addClass("in");

        if ( !inAllowed )
            this.$el.find(".accordion-body").removeClass("in");


        if ( details )
        {
            this.$el.find("table").show();
            this.$el.find(".btn.details").html("Hide details");
        }
        this.$el.find("a[rel=tooltip]").tooltip();
        this.$input = this.$("input.edit");
        this.$editlink = this.$("a.edit");
        return this;
    }
});
